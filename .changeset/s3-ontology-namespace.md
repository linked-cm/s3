---
'@_linked/s3': minor
---

The s3 ontology moves from `http://lincd.org/ont/s3/` to `https://linked.cm/ont/s3/`, the first-party scheme every public package uses (`https://linked.cm/ont/{publicSlug}/`).

No data migration is needed: none of its terms (`s3.Bucket`, `s3.FileStore`, `s3.bucket`, …) types stored data or appears in a shape, since `S3Bucket` and `S3FileStore` are plain classes. The prefix key (`s3`) and the `ontologies/s3` module are unchanged; code that hard-codes `http://lincd.org/ont/s3/` must be updated.
