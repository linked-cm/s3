---
"@_linked/s3": patch
---

Build with `linked build` instead of a hand-rolled `tsc` + `copyfiles` script, and drop the `rimraf`/`copyfiles` devDependencies. The published `lib/` output is unchanged.
