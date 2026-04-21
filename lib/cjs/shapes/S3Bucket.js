"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Bucket = exports.s3Client = exports.createS3Client = exports.endpoint = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const Shape_1 = require("@_linked/core/shapes/Shape");
const s3_js_1 = require("../ontologies/s3.js");
const package_js_1 = require("../package.js");
exports.endpoint = process.env.S3_BUCKET_ENDPOINT;
/**
 * Builds an S3 client from explicit config, falling back to legacy env vars.
 * This enables multiple S3 stores in one process with independent credentials/endpoints.
 */
const createS3Client = (config = {}) => {
    var _a, _b, _c, _d, _e;
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
let S3Bucket = class S3Bucket extends Shape_1.Shape {
    constructor(n, clientConfig) {
        super(typeof n === 'string' ? null : n);
        this.ensureKeyPromise = new Map();
        if (typeof n === 'string') {
            this.label = n;
        }
        this._client = (0, exports.createS3Client)(clientConfig);
    }
    get endpoint() {
        return this._client.config.endpoint.toString();
    }
    /**
     * Delete an object from the bucket.
     * @param key The key of the object to delete
     * @param options Additional options to pass to the DeleteObjectCommand
     * @returns The response from the DeleteObjectCommand
     * @todo Batch delete, see https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html
     */
    deleteObject(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let bucketParams = Object.assign({ Bucket: this.label, Key: key }, options);
            try {
                const data = yield this._client.send(new client_s3_1.DeleteObjectCommand(bucketParams));
                // console.log('Successfully deleted object ' + key);
                return data;
            }
            catch (err) {
                console.log('Could not delete object: ', err);
            }
        });
    }
    copyObject(sourceKey, destinationKey, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let bucketParams = Object.assign({ Bucket: this.label, Key: destinationKey, CopySource: `${this.label}/${sourceKey}` }, options);
            try {
                const data = yield this._client.send(new client_s3_1.CopyObjectCommand(bucketParams));
                // console.log('Successfully copied object ' + sourceKey + ' to ' + destinationKey);
                return data.$metadata.httpStatusCode === 200;
            }
            catch (err) {
                console.log('Could not copy object: ', err);
            }
        });
    }
    /**
     * Put an object into the bucket.
     *
     * @param key The key of the object to PUT (i.e. file name)
     * @param value The value of the object to PUT (i.e. file contents)
     * @param options Additional options to pass to the PutObjectCommand
     * @returns The response from the PutObjectCommand
     */
    putObject(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let bucketParams = Object.assign({ Bucket: this.label, Key: key, Body: value, ACL: 'public-read' }, options);
            try {
                const data = yield this._client.send(new client_s3_1.PutObjectCommand(bucketParams));
                // console.log(
                //   'Successfully uploaded object: ' +
                //     bucketParams.Bucket +
                //     '/' +
                //     bucketParams.Key,
                // );
                return data;
            }
            catch (err) {
                console.log('Error', err);
            }
            return null;
        });
    }
    /**
     * Get a list of all object keys in the bucket.
     * Important to note that only a maximum 1000 keys will be returned.
     *
     * @param prefix The prefix to search for in the bucket. This can be a folder or the beginning of a file name.
     * @returns A list of all object keys in the bucket
     * @todo Recursive search within directories
     * @todo Implement pagination
     */
    getAllObjectKeys() {
        return __awaiter(this, arguments, void 0, function* (prefix = '') {
            var _a;
            let bucketParams = {
                Bucket: this.label,
                Prefix: prefix,
            };
            try {
                const data = yield this._client.send(new client_s3_1.ListObjectsCommand(bucketParams));
                return ((_a = data.Contents) === null || _a === void 0 ? void 0 : _a.map((object) => object.Key)) || [];
            }
            catch (err) {
                console.log('Could not list bucket contents: ', err);
                return Promise.reject(err);
            }
        });
    }
    /**
     * Get the contents of an object in the bucket.
     * @param key The key of the object to get
     * @returns The contents of the object as a string
     */
    getObject(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let bucketParams = {
                Bucket: this.label,
                Key: key,
            };
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const getObjectCommand = new client_s3_1.GetObjectCommand(bucketParams);
                try {
                    const response = yield this._client.send(getObjectCommand);
                    // let objectData = response.Body.toString();
                    // resolve(objectData);
                    //for future usecases: use this to stream data or use binary data,
                    // see https://stackoverflow.com/questions/36942442/how-to-get-response-from-s3-getobject-in-node-js
                    // // Store all of data chunks returned from the response data stream
                    // // into an array then use Array#join() to use the returned contents as a String
                    let responseDataChunks = [];
                    // let body:ReadableStream = response.Body as ReadableStream;
                    let body = response.Body;
                    // Handle an error while streaming the response body
                    body.once('error', (err) => reject(err));
                    // Attach a 'data' listener to add the chunks of data to our array
                    // Each chunk is a Buffer instance
                    body.on('data', (chunk) => responseDataChunks.push(chunk));
                    // Once the stream has no more data, join the chunks into a string and return the string
                    body.once('end', () => resolve(responseDataChunks.join('')));
                }
                catch (err) {
                    // Handle the error or throw
                    return reject(err);
                }
            }));
        });
    }
    /**
     * Ensure that the given key exists in the bucket, the file contents
     * will be an empty json object.
     *
     * @param key The key to insert if it does not exist
     * @returns The promise that will resolve when the key exists
     */
    ensureKeyExists(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.ensureKeyPromise.has(key)) {
                let promise = this._ensureKeyExists(key);
                this.ensureKeyPromise.set(key, promise);
            }
            return this.ensureKeyPromise.get(key);
        });
    }
    _ensureKeyExists(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let bucketParams = {
                Bucket: this.label,
                Key: key,
            };
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                //see if the object already exists
                try {
                    yield this._client.send(new client_s3_1.HeadObjectCommand(bucketParams));
                    resolve();
                }
                catch (error) {
                    if (error.name === 'NotFound') {
                        // Note with v3 AWS-SDK use error.code
                        //If the object does not exist, create it,
                        // with the content being an empty json object
                        try {
                            yield this._client.send(new client_s3_1.PutObjectCommand(Object.assign(Object.assign({}, bucketParams), { Body: JSON.stringify({}) })));
                            // console.log(
                            //   `Successfully created object "${bucketParams.Key}" in bucket ${bucketParams.Bucket}`,
                            // );
                            resolve();
                        }
                        catch (err) {
                            if (err.name === 'NoSuchBucket') {
                                yield this.createBucket();
                                yield this._ensureKeyExists(key);
                                resolve();
                            }
                            reject('Error putting object: ' + err);
                        }
                    }
                    else {
                        reject('Error checking existence of object: ' + error);
                    }
                }
            }));
        });
    }
    keyExists(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let bucketParams = {
                Bucket: this.label,
                Key: key,
            };
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                //see if the object already exists
                try {
                    yield this._client.send(new client_s3_1.HeadObjectCommand(bucketParams));
                    resolve(true);
                }
                catch (error) {
                    if (error.name === 'NotFound') {
                        return false;
                    }
                    else {
                        console.warn('Error checking existence of object: ' + error);
                        return false;
                    }
                }
            }));
        });
    }
    /**
     * Create the bucket if it does not exist.
     * @returns The promise that will resolve when the bucket exists
     */
    createBucket() {
        return __awaiter(this, void 0, void 0, function* () {
            let bucketParams = { Bucket: this.label };
            try {
                const data = yield this._client.send(new client_s3_1.CreateBucketCommand(bucketParams));
                console.log('Successfully created bucket ' + this.label);
                return data; // For unit tests.
            }
            catch (err) {
                console.log('Could not create bucket: ', err);
            }
        });
    }
};
exports.S3Bucket = S3Bucket;
S3Bucket.targetClass = s3_js_1.s3.Bucket;
exports.S3Bucket = S3Bucket = __decorate([
    package_js_1.linkedShape,
    __metadata("design:paramtypes", [Object, Object])
], S3Bucket);
//# sourceMappingURL=S3Bucket.js.map