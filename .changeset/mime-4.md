---
'@_linked/s3': patch
---

Upgrade `mime` to v4. Content types derived from file names are unchanged for common uploads; `.js` and `.mjs` stay `application/javascript` (mime 4 alone would send `text/javascript`). A few rare extensions follow the updated mime database (e.g. `.aac` → `audio/aac`, `.sql` → `application/sql`, `.mts` → `video/mp2t`, `.es` → none).
