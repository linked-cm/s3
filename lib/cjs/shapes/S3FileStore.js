"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileStore = void 0;
const Shape_1 = require("@_linked/core/shapes/Shape");
const mime_1 = __importDefault(require("mime"));
const path_1 = __importDefault(require("path"));
const s3_js_1 = require("../ontologies/s3.js");
const S3Bucket_js_1 = require("./S3Bucket.js");
const trimSlashes = (value = '') => value.replace(/^\/+|\/+$/g, '');
const trimTrailingSlash = (value = '') => value.replace(/\/+$/g, '');
class S3FileStore extends Shape_1.Shape {
    constructor(n, config = {}) {
        if (typeof n === 'string') {
            //set a fixed URI. This is important because the URI needs to match on the frontend and backend
            super(`${process.env.DATA_ROOT}/s3-filestore/${n}`);
            this.label = n;
        }
        else {
            super(n);
        }
        this.config = config;
        this.accessURL = this.resolveAccessURL();
    }
    get bucket() {
        const bucketName = this.resolveBucketName();
        if (!bucketName) {
            throw new Error('S3_FILES_BUCKET_NAME environment variable must be set to use S3FileStore (or pass bucketName in config)');
        }
        if (!this._bucket) {
            this._bucket = new S3Bucket_js_1.S3Bucket(bucketName, this.config.clientConfig);
        }
        return this._bucket;
    }
    resolveBucketName() {
        var _a, _b, _c;
        // Scoped store config wins. Legacy shared env vars stay as fallback to keep
        // existing apps working while allowing upload/static separation.
        return ((_c = (_b = (_a = this.config.bucketName) !== null && _a !== void 0 ? _a : process.env.S3_FILES_BUCKET_NAME) !== null && _b !== void 0 ? _b : process.env.UPLOADS_S3_FILES_BUCKET_NAME) !== null && _c !== void 0 ? _c : process.env.STATIC_S3_FILES_BUCKET_NAME);
    }
    resolveAccessURL() {
        var _a, _b, _c, _d, _e, _f, _g;
        const explicitAccessURL = (_c = (_b = (_a = this.config.accessURL) !== null && _a !== void 0 ? _a : process.env.S3_CDN_URL) !== null && _b !== void 0 ? _b : process.env.UPLOADS_ACCESS_URL) !== null && _c !== void 0 ? _c : process.env.STATIC_ACCESS_URL;
        if (explicitAccessURL) {
            return trimTrailingSlash(explicitAccessURL);
        }
        const endpoint = (_g = (_f = (_e = (_d = this.config.clientConfig) === null || _d === void 0 ? void 0 : _d.endpoint) !== null && _e !== void 0 ? _e : process.env.S3_BUCKET_ENDPOINT) !== null && _f !== void 0 ? _f : process.env.UPLOADS_S3_BUCKET_ENDPOINT) !== null && _g !== void 0 ? _g : process.env.STATIC_S3_BUCKET_ENDPOINT;
        const bucketName = this.resolveBucketName();
        if (endpoint && bucketName) {
            return `${trimTrailingSlash(endpoint)}/${bucketName}`;
        }
        return trimTrailingSlash(endpoint);
    }
    get prefix() {
        var _a;
        // Optional per-store key prefix, used for versioned static publishing.
        return trimSlashes((_a = this.config.prefix) !== null && _a !== void 0 ? _a : '');
    }
    normalizePath(filePath) {
        return filePath.replace(/^\/+/, '');
    }
    applyPrefix(filePath) {
        const normalizedPath = this.normalizePath(filePath);
        if (!this.prefix) {
            return normalizedPath;
        }
        // Guard against accidental double prefixing when callers pass already-prefixed keys.
        if (normalizedPath.startsWith(`${this.prefix}/`)) {
            return normalizedPath;
        }
        return `${this.prefix}/${normalizedPath}`;
    }
    stripPrefix(filePath) {
        if (!this.prefix) {
            return filePath;
        }
        const normalizedPath = this.normalizePath(filePath);
        const prefixedPath = `${this.prefix}/`;
        if (normalizedPath.startsWith(prefixedPath)) {
            return normalizedPath.substring(prefixedPath.length);
        }
        return normalizedPath;
    }
    /**
     * List all files in the bucket
     * @param recursive Whether to list files recursively or just the top-level files
     * @returns A list of file paths, relative to the endpoint
     * @todo Think about taking an options parameter instead of positional args
     * @todo Take a path parameter to list files in a subdirectory
     */
    listFiles(prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            let bucket = this.bucket;
            const keyPrefix = this.prefix
                ? prefix
                    ? this.applyPrefix(prefix)
                    : `${this.prefix}/`
                : prefix;
            return bucket
                .getAllObjectKeys(keyPrefix)
                .then((keys) => keys.map((key) => this.stripPrefix(key)))
                .catch((err) => {
                console.error('Error listing files:', err);
                return [];
            });
        });
    }
    /**
     * Save a file to the bucket
     * @param filePath The path to save the file to, relative to the endpoint
     * @param fileContent The contents of the file as a buffer
     * @returns The public URL of the file
     */
    saveFile(filePath_1, fileContent_1, mimeType_1) {
        return __awaiter(this, arguments, void 0, function* (filePath, fileContent, mimeType, preventDuplicate = false) {
            let bucket = this.bucket;
            filePath = this.normalizePath(filePath);
            if (!mimeType) {
                mimeType = mime_1.default.getType(filePath);
            }
            // console.log(`mimeType of ${filePath} is ${mimeType}`);
            //first check if the object already exists
            if (preventDuplicate && (yield this.fileExists(filePath))) {
                //if yes, use a more unique name based on the current unix timestamp
                filePath = `${path_1.default.dirname(filePath)}/${Date.now()}-${path_1.default.basename(filePath)}`;
                console.log('File already exists, renaming to avoid overwrite: ' + filePath);
            }
            const key = this.applyPrefix(filePath);
            let res = yield bucket
                .putObject(key, fileContent, {
                ContentType: mimeType,
            })
                .catch((err) => {
                console.error('Error saving file to S3:', err);
                return false;
            });
            if (!res) {
                return null;
            }
            return this.accessURL + '/' + filePath;
        });
    }
    /**
     * Get a file from the bucket
     * @param filePath The path of the file to get, relative to the endpoint
     * @returns The contents of the file as a buffer
     */
    getFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let bucket = this.bucket;
            const key = this.applyPrefix(filePath);
            const bufferString = yield bucket.getObject(key);
            return Buffer.from(bufferString, 'base64');
        });
    }
    /**
     * Delete a file from the bucket
     * @param filePath The path of the file to delete, relative to the endpoint
     */
    deleteFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let bucket = this.bucket;
            yield bucket.deleteObject(this.applyPrefix(filePath));
        });
    }
    /**
     * Check if a file exists in the bucket
     * @param filePath The path of the file to check, relative to the endpoint
     * @returns Whether the file exists
     */
    fileExists(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bucket = yield this.bucket.getObject(this.applyPrefix(filePath));
                if (!bucket) {
                    return false;
                }
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.S3FileStore = S3FileStore;
S3FileStore.targetClass = s3_js_1.s3.FileStore;
//# sourceMappingURL=S3FileStore.js.map