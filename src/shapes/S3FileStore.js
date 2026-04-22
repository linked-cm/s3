"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3FileStore = void 0;
var Shape_1 = require("@_linked/core/shapes/Shape");
var mime_1 = __importDefault(require("mime"));
var path_1 = __importDefault(require("path"));
var s3_js_1 = require("../ontologies/s3.js");
var S3Bucket_js_1 = require("./S3Bucket.js");
var trimSlashes = function (value) {
    if (value === void 0) { value = ''; }
    return value.replace(/^\/+|\/+$/g, '');
};
var trimTrailingSlash = function (value) {
    if (value === void 0) { value = ''; }
    return value.replace(/\/+$/g, '');
};
var S3FileStore = /** @class */ (function (_super) {
    __extends(S3FileStore, _super);
    function S3FileStore(n, config) {
        if (config === void 0) { config = {}; }
        var _this = this;
        if (typeof n === 'string') {
            //set a fixed URI. This is important because the URI needs to match on the frontend and backend
            _this = _super.call(this, "".concat(process.env.DATA_ROOT, "/s3-filestore/").concat(n)) || this;
            _this.label = n;
        }
        else {
            _this = _super.call(this, n) || this;
        }
        _this.config = config;
        _this.accessURL = _this.resolveAccessURL();
        return _this;
    }
    Object.defineProperty(S3FileStore.prototype, "bucket", {
        get: function () {
            var bucketName = this.resolveBucketName();
            if (!bucketName) {
                throw new Error('S3_FILES_BUCKET_NAME environment variable must be set to use S3FileStore (or pass bucketName in config)');
            }
            if (!this._bucket) {
                this._bucket = new S3Bucket_js_1.S3Bucket(bucketName, this.config.clientConfig);
            }
            return this._bucket;
        },
        enumerable: false,
        configurable: true
    });
    S3FileStore.prototype.resolveBucketName = function () {
        var _a, _b, _c;
        // Scoped store config wins. Legacy shared env vars stay as fallback to keep
        // existing apps working while allowing upload/static separation.
        return ((_c = (_b = (_a = this.config.bucketName) !== null && _a !== void 0 ? _a : process.env.S3_FILES_BUCKET_NAME) !== null && _b !== void 0 ? _b : process.env.UPLOADS_S3_FILES_BUCKET_NAME) !== null && _c !== void 0 ? _c : process.env.STATIC_S3_FILES_BUCKET_NAME);
    };
    S3FileStore.prototype.resolveAccessURL = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        var explicitAccessURL = (_c = (_b = (_a = this.config.accessURL) !== null && _a !== void 0 ? _a : process.env.S3_CDN_URL) !== null && _b !== void 0 ? _b : process.env.UPLOADS_ACCESS_URL) !== null && _c !== void 0 ? _c : process.env.STATIC_ACCESS_URL;
        if (explicitAccessURL) {
            return trimTrailingSlash(explicitAccessURL);
        }
        var endpoint = (_g = (_f = (_e = (_d = this.config.clientConfig) === null || _d === void 0 ? void 0 : _d.endpoint) !== null && _e !== void 0 ? _e : process.env.S3_BUCKET_ENDPOINT) !== null && _f !== void 0 ? _f : process.env.UPLOADS_S3_BUCKET_ENDPOINT) !== null && _g !== void 0 ? _g : process.env.STATIC_S3_BUCKET_ENDPOINT;
        var bucketName = this.resolveBucketName();
        if (endpoint && bucketName) {
            return "".concat(trimTrailingSlash(endpoint), "/").concat(bucketName);
        }
        return trimTrailingSlash(endpoint);
    };
    Object.defineProperty(S3FileStore.prototype, "prefix", {
        get: function () {
            var _a;
            // Optional per-store key prefix, used for versioned static publishing.
            return trimSlashes((_a = this.config.prefix) !== null && _a !== void 0 ? _a : '');
        },
        enumerable: false,
        configurable: true
    });
    S3FileStore.prototype.normalizePath = function (filePath) {
        return filePath.replace(/^\/+/, '');
    };
    S3FileStore.prototype.applyPrefix = function (filePath) {
        var normalizedPath = this.normalizePath(filePath);
        if (!this.prefix) {
            return normalizedPath;
        }
        // Guard against accidental double prefixing when callers pass already-prefixed keys.
        if (normalizedPath.startsWith("".concat(this.prefix, "/"))) {
            return normalizedPath;
        }
        return "".concat(this.prefix, "/").concat(normalizedPath);
    };
    S3FileStore.prototype.stripPrefix = function (filePath) {
        if (!this.prefix) {
            return filePath;
        }
        var normalizedPath = this.normalizePath(filePath);
        var prefixedPath = "".concat(this.prefix, "/");
        if (normalizedPath.startsWith(prefixedPath)) {
            return normalizedPath.substring(prefixedPath.length);
        }
        return normalizedPath;
    };
    /**
     * List all files in the bucket
     * @param recursive Whether to list files recursively or just the top-level files
     * @returns A list of file paths, relative to the endpoint
     * @todo Think about taking an options parameter instead of positional args
     * @todo Take a path parameter to list files in a subdirectory
     */
    S3FileStore.prototype.listFiles = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket, keyPrefix;
            var _this = this;
            return __generator(this, function (_a) {
                bucket = this.bucket;
                keyPrefix = this.prefix
                    ? prefix
                        ? this.applyPrefix(prefix)
                        : "".concat(this.prefix, "/")
                    : prefix;
                return [2 /*return*/, bucket
                        .getAllObjectKeys(keyPrefix)
                        .then(function (keys) { return keys.map(function (key) { return _this.stripPrefix(key); }); })
                        .catch(function (err) {
                        console.error('Error listing files:', err);
                        return [];
                    })];
            });
        });
    };
    /**
     * Save a file to the bucket
     * @param filePath The path to save the file to, relative to the endpoint
     * @param fileContent The contents of the file as a buffer
     * @returns The public URL of the file
     */
    S3FileStore.prototype.saveFile = function (filePath_1, fileContent_1, mimeType_1) {
        return __awaiter(this, arguments, void 0, function (filePath, fileContent, mimeType, preventDuplicate) {
            var bucket, _a, key, res;
            if (preventDuplicate === void 0) { preventDuplicate = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        bucket = this.bucket;
                        filePath = this.normalizePath(filePath);
                        if (!mimeType) {
                            mimeType = mime_1.default.getType(filePath);
                        }
                        _a = preventDuplicate;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fileExists(filePath)];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        // console.log(`mimeType of ${filePath} is ${mimeType}`);
                        //first check if the object already exists
                        if (_a) {
                            //if yes, use a more unique name based on the current unix timestamp
                            filePath = "".concat(path_1.default.dirname(filePath), "/").concat(Date.now(), "-").concat(path_1.default.basename(filePath));
                            console.log('File already exists, renaming to avoid overwrite: ' + filePath);
                        }
                        key = this.applyPrefix(filePath);
                        return [4 /*yield*/, bucket
                                .putObject(key, fileContent, {
                                ContentType: mimeType,
                            })
                                .catch(function (err) {
                                console.error('Error saving file to S3:', err);
                                return false;
                            })];
                    case 3:
                        res = _b.sent();
                        if (!res) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.accessURL + '/' + filePath];
                }
            });
        });
    };
    /**
     * Get a file from the bucket
     * @param filePath The path of the file to get, relative to the endpoint
     * @returns The contents of the file as a buffer
     */
    S3FileStore.prototype.getFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket, key, bufferString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bucket = this.bucket;
                        key = this.applyPrefix(filePath);
                        return [4 /*yield*/, bucket.getObject(key)];
                    case 1:
                        bufferString = _a.sent();
                        return [2 /*return*/, Buffer.from(bufferString, 'base64')];
                }
            });
        });
    };
    /**
     * Delete a file from the bucket
     * @param filePath The path of the file to delete, relative to the endpoint
     */
    S3FileStore.prototype.deleteFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bucket = this.bucket;
                        return [4 /*yield*/, bucket.deleteObject(this.applyPrefix(filePath))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if a file exists in the bucket
     * @param filePath The path of the file to check, relative to the endpoint
     * @returns Whether the file exists
     */
    S3FileStore.prototype.fileExists = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.bucket.getObject(this.applyPrefix(filePath))];
                    case 1:
                        bucket = _a.sent();
                        if (!bucket) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    S3FileStore.targetClass = s3_js_1.s3.FileStore;
    return S3FileStore;
}(Shape_1.Shape));
exports.S3FileStore = S3FileStore;
//# sourceMappingURL=S3FileStore.js.map