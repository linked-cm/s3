"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./types.js");
require("./ontologies/s3.js");
//SHAPES FIRST
require("./shapes/S3Bucket.js");
require("./shapes/S3FileStore.js");
// Old quad-store patterns — depend on N3FileStore/BackendStore (in modules_old)
// import './shapes/S3FrontendStore.js';
// import './shapes/S3FrontendStoreProvider.js';
// import './shapes/S3QuadStore.js';
//THEN COMPONENTS
require("./utils/accessUrl.js");
//# sourceMappingURL=index.js.map