# Official Go testing references

- `testing`: https://pkg.go.dev/testing
- `net/http/httptest`: https://pkg.go.dev/net/http/httptest
- `go test` command and flags: https://pkg.go.dev/cmd/go#hdr-Test_packages
- Go race detector: https://go.dev/doc/articles/race_detector
- Stable `testing/synctest` API (Go 1.25+): https://pkg.go.dev/testing/synctest
- Go 1.25 release notes: https://go.dev/doc/go1.25
- Fuzzing tutorial: https://go.dev/doc/tutorial/fuzz
- `go test` coverage: https://go.dev/blog/cover
- `t.TempDir` / `t.Setenv` / `t.Cleanup`: https://pkg.go.dev/testing#T

Treat test flags and helper availability as toolchain-version dependent. Follow the target repository's test runner commands first.

