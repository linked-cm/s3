# lincd-s3

A plug-n-play solution for using an S3 Bucket in LINCD.

In place of your usual backend store, you can use the following to get started with S3:

```ts
// ...
const {
  LinkedFileStorage,
} = require('@_linked/core/lib/utils/LinkedFileStorage');
const { LinkedStorage } = require('@_linked/core/lib/utils/LinkedStorage');
const { S3QuadStore } = require('lincd-s3/lib/shapes/S3QuadStore');
const { S3FileStore } = require('lincd-s3/lib/shapes/S3FileStore');

// This translates to be the Object name in the bucket. If no object
// is found with this name, then one will be created - just like how a
// regular NodeFileStore works!
const QUADSTORE_NAME = 'foo-bar-data';
const s3Quads = new S3QuadStore(QUADSTORE_NAME);

LinkedStorage.setDefaultStore(s3Quads);

// Set up an S3 Filestore
const FILESTORE_NAME = 'baz-qux-files';
const s3Files = new S3FileStore(FILESTORE_NAME);

LinkedFileStorage.setDefaultStore(s3Files);
// ...
```

## Environment Variables

Unless stated otherwise, the following environment variables are required:

```properties
# Generated using whatever service is hosting your bucket
AWS_ACCESS_KEY_ID=ABC123XYZ789
AWS_SECRET_ACCESS_KEY=aBc123Def456xYz789

# The endpoint on which your bucket resides. It's important to note that
# this is the HOST address of your bucket - i.e. it SHOULDN'T contain
# your bucket name!!
S3_BUCKET_ENDPOINT=https://my.bucket-provider.com

# The name of your buckets
S3_FILES_BUCKET_NAME=my-file-bucket
S3_QUADS_BUCKET_NAME=my-data-bucket

# OPTIONAL: If using a CDN, you can specify the URL here and it will be used
S3_CDN_URL=https://my.cdn-provider.com
```

The S3 client will automagically form the correct URL for your bucket - in this case it would
be https://my-data-bucket.my.bucket-provider.com or https://my-file-bucket.my.bucket-provider.com

## See also:

- [lincd-filebase](https://www.npmjs.com/package/lincd-filebase) - An implementation
  for [filebase](https://filebase.com) IPFS bucket storage
