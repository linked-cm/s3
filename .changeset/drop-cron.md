---
'@_linked/s3': patch
---

Drop the unused `cron` dependency. Nothing in this package imports it, so installs get lighter and behaviour is unchanged.
