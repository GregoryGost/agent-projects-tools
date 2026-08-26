import {
  copyFile,
  lstat,
  mkdir,
  readdir,
  readFile,
} from "node:fs/promises"
import {
  dirname,
  extname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from "node:path"
import process from "node:process"

const CONFIG_KEY = "node-red-build"
const CHECK_FLAG = "--check"
const HELP_FLAG = "--help"
const ALLOWED_CONFIG_KEYS = new Set([
  "sourceRoot",
  "outputRoot",
  "editorHtml",
  "copy",
])

function fail(message) {
  throw new Error(`[node-red-postbuild] ${message}`)
}

function printHelp() {
  console.log(`Usage: node scripts/node-red-postbuild.mjs [${CHECK_FLAG}]

Reads package.json fields:
  node-red.nodes                 Node-RED runtime artifacts to validate
  ${CONFIG_KEY}.outputRoot       Generated runtime node-set root
  ${CONFIG_KEY}.editorHtml       "copy" or "validate-only"
  ${CONFIG_KEY}.sourceRoot       Required only when editorHtml is "copy"
  ${CONFIG_KEY}.copy             Optional explicit file/directory copy mappings

${CHECK_FLAG} validates the existing artifacts without writing files.`)
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} must be a non-empty string`)
  }
  return value
}

function isInside(basePath, candidatePath) {
  const pathFromBase = relative(basePath, candidatePath)
  return (
    pathFromBase === "" ||
    (!isAbsolute(pathFromBase) &&
      pathFromBase !== ".." &&
      !pathFromBase.startsWith(`..${sep}`))
  )
}

function pathsOverlap(leftPath, rightPath) {
  return isInside(leftPath, rightPath) || isInside(rightPath, leftPath)
}

function resolveInside(basePath, value, label) {
  const input = assertNonEmptyString(value, label)
  if (isAbsolute(input)) {
    fail(`${label} must be relative to the project root`)
  }

  const resolved = resolve(basePath, input)
  if (!isInside(basePath, resolved)) {
    fail(`${label} escapes the project root: ${input}`)
  }
  return resolved
}

async function getPathInfo(targetPath) {
  try {
    return await lstat(targetPath)
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return null
    }
    throw error
  }
}

async function assertNoSymlinkPath(projectRoot, targetPath, label) {
  if (!isInside(projectRoot, targetPath)) {
    fail(`${label} escapes the project root: ${targetPath}`)
  }

  const pathFromRoot = relative(projectRoot, targetPath)
  if (pathFromRoot === "") {
    return
  }

  let current = projectRoot
  for (const segment of pathFromRoot.split(sep)) {
    current = resolve(current, segment)
    const info = await getPathInfo(current)
    if (!info) {
      break
    }
    if (info.isSymbolicLink()) {
      fail(`${label} traverses a symbolic link: ${current}`)
    }
  }
}

async function requireRegularFile(targetPath, label) {
  const info = await getPathInfo(targetPath)
  if (!info) {
    fail(`${label} is missing: ${targetPath}`)
  }
  if (info.isSymbolicLink()) {
    fail(`${label} must not be a symbolic link: ${targetPath}`)
  }
  if (!info.isFile()) {
    fail(`${label} must be a regular file: ${targetPath}`)
  }
  return info
}

async function readJson(filePath, label) {
  await requireRegularFile(filePath, label)
  let parsed
  try {
    parsed = JSON.parse(await readFile(filePath, "utf8"))
  } catch (error) {
    fail(`${label} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
  if (!isRecord(parsed)) {
    fail(`${label} must contain a JSON object`)
  }
  return parsed
}

async function filesEqual(leftPath, rightPath) {
  const [left, right] = await Promise.all([
    readFile(leftPath),
    readFile(rightPath),
  ])
  return left.equals(right)
}

async function assertFileInSync(sourcePath, targetPath, label) {
  await requireRegularFile(sourcePath, `${label} source`)
  await requireRegularFile(targetPath, `${label} output`)
  if (!(await filesEqual(sourcePath, targetPath))) {
    fail(`${label} output is stale: ${targetPath}`)
  }
}

async function copyRegularFile(sourcePath, targetPath, label, checkOnly) {
  await requireRegularFile(sourcePath, `${label} source`)

  if (sourcePath === targetPath) {
    return
  }

  if (checkOnly) {
    await assertFileInSync(sourcePath, targetPath, label)
    return
  }

  const targetInfo = await getPathInfo(targetPath)
  if (targetInfo?.isSymbolicLink()) {
    fail(`${label} output must not be a symbolic link: ${targetPath}`)
  }
  if (targetInfo && !targetInfo.isFile()) {
    fail(`${label} output must be a regular file: ${targetPath}`)
  }

  await mkdir(dirname(targetPath), { recursive: true })
  await copyFile(sourcePath, targetPath)
}

async function readDirectoryEntries(directoryPath, label) {
  const info = await getPathInfo(directoryPath)
  if (!info) {
    return null
  }
  if (info.isSymbolicLink()) {
    fail(`${label} must not be a symbolic link: ${directoryPath}`)
  }
  if (!info.isDirectory()) {
    fail(`${label} must be a directory: ${directoryPath}`)
  }
  return readdir(directoryPath, { withFileTypes: true })
}

async function copyTree(sourcePath, targetPath, label, checkOnly) {
  const sourceInfo = await getPathInfo(sourcePath)
  if (!sourceInfo) {
    fail(`${label} source is missing: ${sourcePath}`)
  }
  if (sourceInfo.isSymbolicLink()) {
    fail(`${label} source must not be a symbolic link: ${sourcePath}`)
  }

  if (sourcePath === targetPath) {
    return
  }

  if (pathsOverlap(sourcePath, targetPath)) {
    fail(`${label} source and output must not overlap`)
  }

  if (sourceInfo.isFile()) {
    await copyRegularFile(sourcePath, targetPath, label, checkOnly)
    return
  }

  if (!sourceInfo.isDirectory()) {
    fail(`${label} source must be a regular file or directory: ${sourcePath}`)
  }

  const sourceEntries = await readDirectoryEntries(sourcePath, `${label} source`)
  const targetEntries = await readDirectoryEntries(targetPath, `${label} output`)

  if (!checkOnly && targetEntries === null) {
    await mkdir(targetPath, { recursive: true })
  } else if (checkOnly && targetEntries === null) {
    fail(`${label} output is missing: ${targetPath}`)
  }

  const sourceNames = sourceEntries.map((entry) => entry.name).sort()
  const targetNames = (targetEntries ?? []).map((entry) => entry.name).sort()
  const sourceNameSet = new Set(sourceNames)
  const staleTargetNames = targetNames.filter((name) => !sourceNameSet.has(name))

  if (staleTargetNames.length > 0) {
    fail(
      `${label} output contains stale path(s): ${staleTargetNames.join(", ")}`,
    )
  }

  if (checkOnly && sourceNames.join("\0") !== targetNames.join("\0")) {
    fail(`${label} output file set is stale: ${targetPath}`)
  }

  for (const entry of sourceEntries) {
    if (entry.isSymbolicLink()) {
      fail(`${label} source contains a symbolic link: ${resolve(sourcePath, entry.name)}`)
    }
    await copyTree(
      resolve(sourcePath, entry.name),
      resolve(targetPath, entry.name),
      `${label}/${entry.name}`,
      checkOnly,
    )
  }
}

function parseCopyMappings(value) {
  if (value === undefined) {
    return []
  }
  if (!Array.isArray(value)) {
    fail(`${CONFIG_KEY}.copy must be an array`)
  }

  return value.map((mapping, index) => {
    const label = `${CONFIG_KEY}.copy[${index}]`
    if (!isRecord(mapping)) {
      fail(`${label} must be an object`)
    }

    const allowed = new Set(["from", "to", "optional"])
    for (const key of Object.keys(mapping)) {
      if (!allowed.has(key)) {
        fail(`${label} contains unsupported key: ${key}`)
      }
    }

    if (mapping.optional !== undefined && typeof mapping.optional !== "boolean") {
      fail(`${label}.optional must be boolean when provided`)
    }

    return {
      from: assertNonEmptyString(mapping.from, `${label}.from`),
      to: assertNonEmptyString(mapping.to, `${label}.to`),
      optional: mapping.optional === true,
      label,
    }
  })
}

function resolveCopyMappings(projectRoot, mappings) {
  return mappings.map((mapping) => ({
    ...mapping,
    sourcePath: resolveInside(projectRoot, mapping.from, `${mapping.label}.from`),
    targetPath: resolveInside(projectRoot, mapping.to, `${mapping.label}.to`),
  }))
}

function validateCopyMappingGraph(mappings) {
  for (let leftIndex = 0; leftIndex < mappings.length; leftIndex += 1) {
    const left = mappings[leftIndex]
    for (let rightIndex = leftIndex + 1; rightIndex < mappings.length; rightIndex += 1) {
      const right = mappings[rightIndex]

      if (pathsOverlap(left.targetPath, right.targetPath)) {
        fail(`${left.label}.to overlaps ${right.label}.to`)
      }
      if (pathsOverlap(left.targetPath, right.sourcePath)) {
        fail(`${left.label}.to overlaps ${right.label}.from`)
      }
      if (pathsOverlap(right.targetPath, left.sourcePath)) {
        fail(`${right.label}.to overlaps ${left.label}.from`)
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes(HELP_FLAG)) {
    printHelp()
    return
  }

  const unknownArgs = args.filter((arg) => arg !== CHECK_FLAG)
  if (unknownArgs.length > 0) {
    fail(`unsupported argument(s): ${unknownArgs.join(", ")}`)
  }
  const checkOnly = args.includes(CHECK_FLAG)

  const projectRoot = process.cwd()
  const packagePath = resolve(projectRoot, "package.json")
  const packageJson = await readJson(packagePath, "package.json")

  const config = packageJson[CONFIG_KEY]
  if (!isRecord(config)) {
    fail(`package.json must define a ${CONFIG_KEY} object`)
  }
  for (const key of Object.keys(config)) {
    if (!ALLOWED_CONFIG_KEYS.has(key)) {
      fail(`${CONFIG_KEY} contains unsupported key: ${key}`)
    }
  }

  const editorHtml = config.editorHtml ?? "copy"
  if (editorHtml !== "copy" && editorHtml !== "validate-only") {
    fail(`${CONFIG_KEY}.editorHtml must be "copy" or "validate-only"`)
  }

  const outputRoot = resolveInside(
    projectRoot,
    config.outputRoot,
    `${CONFIG_KEY}.outputRoot`,
  )
  await assertNoSymlinkPath(projectRoot, outputRoot, `${CONFIG_KEY}.outputRoot`)

  let sourceRoot = null
  if (editorHtml === "copy") {
    sourceRoot = resolveInside(
      projectRoot,
      config.sourceRoot,
      `${CONFIG_KEY}.sourceRoot`,
    )
    await assertNoSymlinkPath(projectRoot, sourceRoot, `${CONFIG_KEY}.sourceRoot`)
    if (pathsOverlap(sourceRoot, outputRoot)) {
      fail(`${CONFIG_KEY}.sourceRoot and ${CONFIG_KEY}.outputRoot must not overlap in copy mode`)
    }
  } else if (config.sourceRoot !== undefined) {
    sourceRoot = resolveInside(
      projectRoot,
      config.sourceRoot,
      `${CONFIG_KEY}.sourceRoot`,
    )
    await assertNoSymlinkPath(projectRoot, sourceRoot, `${CONFIG_KEY}.sourceRoot`)
  }

  const nodeRed = packageJson["node-red"]
  if (!isRecord(nodeRed) || !isRecord(nodeRed.nodes)) {
    fail("package.json must define node-red.nodes")
  }

  const nodeEntries = Object.entries(nodeRed.nodes)
  if (nodeEntries.length === 0) {
    fail("package.json node-red.nodes must contain at least one node set")
  }

  const protectedArtifactPaths = []
  let nodeSetCount = 0
  for (const [nodeSetName, runtimeValue] of nodeEntries) {
    const runtimeRelative = assertNonEmptyString(
      runtimeValue,
      `node-red.nodes.${nodeSetName}`,
    )
    if (extname(runtimeRelative).toLowerCase() !== ".js") {
      fail(`node-red.nodes.${nodeSetName} must point to a .js runtime artifact`)
    }

    const runtimePath = resolveInside(
      projectRoot,
      runtimeRelative,
      `node-red.nodes.${nodeSetName}`,
    )
    if (!isInside(outputRoot, runtimePath)) {
      fail(`node-red.nodes.${nodeSetName} must point inside ${config.outputRoot}`)
    }
    await assertNoSymlinkPath(
      projectRoot,
      runtimePath,
      `node-red.nodes.${nodeSetName}`,
    )
    await requireRegularFile(runtimePath, `runtime artifact for ${nodeSetName}`)

    const editorOutputPath = runtimePath.replace(/\.js$/i, ".html")
    await assertNoSymlinkPath(
      projectRoot,
      editorOutputPath,
      `editor HTML output for ${nodeSetName}`,
    )

    if (editorHtml === "copy") {
      const htmlRelativeToOutput = relative(outputRoot, editorOutputPath)
      const editorSourcePath = resolve(sourceRoot, htmlRelativeToOutput)
      if (!isInside(sourceRoot, editorSourcePath)) {
        fail(`editor HTML source for ${nodeSetName} escapes ${config.sourceRoot}`)
      }
      await assertNoSymlinkPath(
        projectRoot,
        editorSourcePath,
        `editor HTML source for ${nodeSetName}`,
      )
      await copyRegularFile(
        editorSourcePath,
        editorOutputPath,
        `editor HTML for ${nodeSetName}`,
        checkOnly,
      )
    } else {
      await requireRegularFile(editorOutputPath, `editor HTML for ${nodeSetName}`)
    }

    await requireRegularFile(editorOutputPath, `editor HTML for ${nodeSetName}`)
    protectedArtifactPaths.push(runtimePath, editorOutputPath)
    nodeSetCount += 1
  }

  const copyMappings = resolveCopyMappings(
    projectRoot,
    parseCopyMappings(config.copy),
  )
  validateCopyMappingGraph(copyMappings)

  let copyCount = 0
  for (const mapping of copyMappings) {
    await assertNoSymlinkPath(projectRoot, mapping.sourcePath, `${mapping.label}.from`)
    await assertNoSymlinkPath(projectRoot, mapping.targetPath, `${mapping.label}.to`)

    for (const protectedPath of protectedArtifactPaths) {
      if (pathsOverlap(mapping.targetPath, protectedPath)) {
        fail(`${mapping.label}.to overlaps a protected Node-RED node-set artifact`)
      }
    }

    const sourceInfo = await getPathInfo(mapping.sourcePath)
    if (!sourceInfo && mapping.optional) {
      const targetInfo = await getPathInfo(mapping.targetPath)
      if (targetInfo) {
        fail(`${mapping.label} source is absent but stale output remains: ${mapping.targetPath}`)
      }
      continue
    }
    if (!sourceInfo) {
      fail(`${mapping.label} source is missing: ${mapping.sourcePath}`)
    }

    await copyTree(
      mapping.sourcePath,
      mapping.targetPath,
      mapping.label,
      checkOnly,
    )
    copyCount += 1
  }

  console.log(
    `[node-red-postbuild] ${checkOnly ? "validated" : "assembled"} ${nodeSetCount} node set(s)` +
      (copyCount > 0 ? ` and ${copyCount} explicit copy mapping(s)` : ""),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
