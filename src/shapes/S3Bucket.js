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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Bucket = exports.s3Client = exports.createS3Client = exports.endpoint = void 0;
var client_s3_1 = require("@aws-sdk/client-s3");
var Shape_1 = require("@_linked/core/shapes/Shape");
var s3_js_1 = require("../ontologies/s3.js");
var package_js_1 = require("../package.js");
exports.endpoint = process.env.S3_BUCKET_ENDPOINT;
/**
 * Builds an S3 client from explicit config, falling back to legacy env vars.
 * This enables multiple S3 stores in one process with independent credentials/endpoints.
 */
var createS3Client = function (config) {
    var _a, _b, _c, _d, _e;
    if (config === void 0) { config = {}; }
    return new client_s3_1.S3Client({
        endpoint: (_a = config.endpoint) !== null && _a !== void 0 ? _a : process.env.S3_BUCKET_ENDPOINT,
        // https://github.com/aws/aws-sdk-js-v3/issues/3392#issuecomment-1120027821
        credentials: {
            accessKeyId: (_b = config.accessKeyId) !== null && _b !== void 0 ? _b : process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: (_c = config.secretAccessKey) !== null && _c !== void 0 ? _c : process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: (_e = (_d = config.region) !== null && _d !== void 0 ? _d : process.env.AWS_REGION) !== null && _e !== void 0 ? _e : 'us-east-1',
    });
};
exports.createS3Client = createS3Client;
/**
 * Legacy singleton exported for backward compatibility. New code should prefer
 * per-instance clients by passing config into S3Bucket/S3FileStore.
 */
exports.s3Client = (0, exports.createS3Client)();
var S3Bucket = /** @class */ (function (_super) {
    __extends(S3Bucket, _super);
    function S3Bucket(n, clientConfig) {
        var _this = _super.call(this, typeof n === 'string' ? null : n) || this;
        _this.ensureKeyPromise = new Map();
        if (typeof n === 'string') {
            _this.label = n;
        }
        _this._client = (0, exports.createS3Client)(clientConfig);
        return _this;
    }
    Object.defineProperty(S3Bucket.prototype, "endpoint", {
        get: function () {
            return this._client.config.endpoint.toString();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Delete an object from the bucket.
     * @param key The key of the object to delete
     * @param options Additional options to pass to the DeleteObjectCommand
     * @returns The response from the DeleteObjectCommand
     * @todo Batch delete, see https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html
     */
    S3Bucket.prototype.deleteObject = function (key, options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bucketParams = __assign({ Bucket: this.label, Key: key }, options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._client.send(new client_s3_1.DeleteObjectCommand(bucketParams))];
                    case 2:
                        data = _a.sent();
                        // console.log('Successfully deleted object ' + key);
                        return [2 /*return*/, data];
                    case 3:
                        err_1 = _a.sent();
                        console.log('Could not delete object: ', err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    S3Bucket.prototype.copyObject = function (sourceKey, destinationKey, options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bucketParams = __assign({ Bucket: this.label, Key: destinationKey, CopySource: "".concat(this.label, "/").concat(sourceKey) }, options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._client.send(new client_s3_1.CopyObjectCommand(bucketParams))];
                    case 2:
                        data = _a.sent();
                        // console.log('Successfully copied object ' + sourceKey + ' to ' + destinationKey);
                        return [2 /*return*/, data.$metadata.httpStatusCode === 200];
                    case 3:
                        err_2 = _a.sent();
                        console.log('Could not copy object: ', err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Put an object into the bucket.
     *
     * @param key The key of the object to PUT (i.e. file name)
     * @param value The value of the object to PUT (i.e. file contents)
     * @param options Additional options to pass to the PutObjectCommand
     * @returns The response from the PutObjectCommand
     */
    S3Bucket.prototype.putObject = function (key, value, options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams, data, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bucketParams = __assign({ Bucket: this.label, Key: key, Body: value, ACL: 'public-read' }, options);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._client.send(new client_s3_1.PutObjectCommand(bucketParams))];
                    case 2:
                        data = _a.sent();
                        // console.log(
                        //   'Successfully uploaded object: ' +
                        //     bucketParams.Bucket +
                        //     '/' +
                        //     bucketParams.Key,
                        // );
                        return [2 /*return*/, data];
                    case 3:
                        err_3 = _a.sent();
                        console.log('Error', err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Get a list of all object keys in the bucket.
     * Important to note that only a maximum 1000 keys will be returned.
     *
     * @param prefix The prefix to search for in the bucket. This can be a folder or the beginning of a file name.
     * @returns A list of all object keys in the bucket
     * @todo Recursive search within directories
     * @todo Implement pagination
     */
    S3Bucket.prototype.getAllObjectKeys = function () {
        return __awaiter(this, arguments, void 0, function (prefix) {
            var bucketParams, data, err_4;
            var _a;
            if (prefix === void 0) { prefix = ''; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        bucketParams = {
                            Bucket: this.label,
                            Prefix: prefix,
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._client.send(new client_s3_1.ListObjectsCommand(bucketParams))];
                    case 2:
                        data = _b.sent();
                        return [2 /*return*/, ((_a = data.Contents) === null || _a === void 0 ? void 0 : _a.map(function (object) { return object.Key; })) || []];
                    case 3:
                        err_4 = _b.sent();
                        console.log('Could not list bucket contents: ', err_4);
                        return [2 /*return*/, Promise.reject(err_4)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get the contents of an object in the bucket.
     * @param key The key of the object to get
     * @returns The contents of the object as a string
     */
    S3Bucket.prototype.getObject = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams;
            var _this = this;
            return __generator(this, function (_a) {
                bucketParams = {
                    Bucket: this.label,
                    Key: key,
                };
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var getObjectCommand, response, responseDataChunks_1, body, err_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    getObjectCommand = new client_s3_1.GetObjectCommand(bucketParams);
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, this._client.send(getObjectCommand)];
                                case 2:
                                    response = _a.sent();
                                    responseDataChunks_1 = [];
                                    body = response.Body;
                                    // Handle an error while streaming the response body
                                    body.once('error', function (err) { return reject(err); });
                                    // Attach a 'data' listener to add the chunks of data to our array
                                    // Each chunk is a Buffer instance
                                    body.on('data', function (chunk) { return responseDataChunks_1.push(chunk); });
                                    // Once the stream has no more data, join the chunks into a string and return the string
                                    body.once('end', function () { return resolve(responseDataChunks_1.join('')); });
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_5 = _a.sent();
                                    // Handle the error or throw
                                    return [2 /*return*/, reject(err_5)];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Ensure that the given key exists in the bucket, the file contents
     * will be an empty json object.
     *
     * @param key The key to insert if it does not exist
     * @returns The promise that will resolve when the key exists
     */
    S3Bucket.prototype.ensureKeyExists = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_a) {
                if (!this.ensureKeyPromise.has(key)) {
                    promise = this._ensureKeyExists(key);
                    this.ensureKeyPromise.set(key, promise);
                }
                return [2 /*return*/, this.ensureKeyPromise.get(key)];
            });
        });
    };
    S3Bucket.prototype._ensureKeyExists = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams;
            var _this = this;
            return __generator(this, function (_a) {
                bucketParams = {
                    Bucket: this.label,
                    Key: key,
                };
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var error_1, err_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 12]);
                                    return [4 /*yield*/, this._client.send(new client_s3_1.HeadObjectCommand(bucketParams))];
                                case 1:
                                    _a.sent();
                                    resolve();
                                    return [3 /*break*/, 12];
                                case 2:
                                    error_1 = _a.sent();
                                    if (!(error_1.name === 'NotFound')) return [3 /*break*/, 10];
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, 5, , 9]);
                                    return [4 /*yield*/, this._client.send(new client_s3_1.PutObjectCommand(__assign(__assign({}, bucketParams), { Body: JSON.stringify({}) })))];
                                case 4:
                                    _a.sent();
                                    // console.log(
                                    //   `Successfully created object "${bucketParams.Key}" in bucket ${bucketParams.Bucket}`,
                                    // );
                                    resolve();
                                    return [3 /*break*/, 9];
                                case 5:
                                    err_6 = _a.sent();
                                    if (!(err_6.name === 'NoSuchBucket')) return [3 /*break*/, 8];
                                    return [4 /*yield*/, this.createBucket()];
                                case 6:
                                    _a.sent();
                                    return [4 /*yield*/, this._ensureKeyExists(key)];
                                case 7:
                                    _a.sent();
                                    resolve();
                                    _a.label = 8;
                                case 8:
                                    reject('Error putting object: ' + err_6);
                                    return [3 /*break*/, 9];
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    reject('Error checking existence of object: ' + error_1);
                                    _a.label = 11;
                                case 11: return [3 /*break*/, 12];
                                case 12: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    S3Bucket.prototype.keyExists = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams;
            var _this = this;
            return __generator(this, function (_a) {
                bucketParams = {
                    Bucket: this.label,
                    Key: key,
                };
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, this._client.send(new client_s3_1.HeadObjectCommand(bucketParams))];
                                case 1:
                                    _a.sent();
                                    resolve(true);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _a.sent();
                                    if (error_2.name === 'NotFound') {
                                        return [2 /*return*/, false];
                                    }
                                    else {
                                        console.warn('Error checking existence of object: ' + error_2);
                                        return [2 /*return*/, false];
                                    }
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Create the bucket if it does not exist.
     * @returns The promise that will resolve when the bucket exists
     */
    S3Bucket.prototype.createBucket = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bucketParams, data, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bucketParams = { Bucket: this.label };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._client.send(new client_s3_1.CreateBucketCommand(bucketParams))];
                    case 2:
                        data = _a.sent();
                        console.log('Successfully created bucket ' + this.label);
                        return [2 /*return*/, data]; // For unit tests.
                    case 3:
                        err_7 = _a.sent();
                        console.log('Could not create bucket: ', err_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    S3Bucket.targetClass = s3_js_1.s3.Bucket;
    S3Bucket = __decorate([
        package_js_1.linkedShape,
        __metadata("design:paramtypes", [Object, Object])
    ], S3Bucket);
    return S3Bucket;
}(Shape_1.Shape));
exports.S3Bucket = S3Bucket;
//# sourceMappingURL=S3Bucket.js.map