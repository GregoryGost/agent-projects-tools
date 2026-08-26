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
  ${CONFIG_KEY}.sourceRoot       TypeScript/editor source root
  ${CONFIG_KEY}.outputRoot       Generated runtime node-set root
  ${CONFIG_KEY}.editorHtml       "copy" or "validate-only"
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

  if (isInside(sourcePath, targetPath) || isInside(targetPath, sourcePath)) {
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

  const sourceRoot = resolveInside(
    projectRoot,
    config.sourceRoot,
    `${CONFIG_KEY}.sourceRoot`,
  )
  const outputRoot = resolveInside(
    projectRoot,
    config.outputRoot,
    `${CONFIG_KEY}.outputRoot`,
  )

  const editorHtml = config.editorHtml ?? "copy"
  if (editorHtml !== "copy" && editorHtml !== "validate-only") {
    fail(`${CONFIG_KEY}.editorHtml must be "copy" or "validate-only"`)
  }

  const nodeRed = packageJson["node-red"]
  if (!isRecord(nodeRed) || !isRecord(nodeRed.nodes)) {
    fail("package.json must define node-red.nodes")
  }

  const nodeEntries = Object.entries(nodeRed.nodes)
  if (nodeEntries.length === 0) {
    fail("package.json node-red.nodes must contain at least one node set")
  }

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
    await requireRegularFile(runtimePath, `runtime artifact for ${nodeSetName}`)

    const editorOutputPath = runtimePath.replace(/\.js$/i, ".html")
    const htmlRelativeToOutput = relative(outputRoot, editorOutputPath)
    const editorSourcePath = resolve(sourceRoot, htmlRelativeToOutput)
    if (!isInside(sourceRoot, editorSourcePath)) {
      fail(`editor HTML source for ${nodeSetName} escapes ${config.sourceRoot}`)
    }

    if (editorHtml === "copy") {
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
    nodeSetCount += 1
  }

  const copyMappings = parseCopyMappings(config.copy)
  let copyCount = 0
  for (const mapping of copyMappings) {
    const sourcePath = resolveInside(projectRoot, mapping.from, `${mapping.label}.from`)
    const targetPath = resolveInside(projectRoot, mapping.to, `${mapping.label}.to`)
    const sourceInfo = await getPathInfo(sourcePath)

    if (!sourceInfo && mapping.optional) {
      continue
    }
    if (!sourceInfo) {
      fail(`${mapping.label} source is missing: ${sourcePath}`)
    }

    await copyTree(sourcePath, targetPath, mapping.label, checkOnly)
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
