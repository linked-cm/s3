"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessURLS3FileStore = exports.getAccessURLStaticStore = exports.getAccessURLUploadsStore = void 0;
var trimTrailingSlash = function (value) {
    if (value === void 0) { value = ''; }
    return value.replace(/\/+$/g, '');
};
var trimSlashes = function (value) {
    if (value === void 0) { value = ''; }
    return value.replace(/^\/+|\/+$/g, '');
};
/**
 * Read env vars in a browser-safe way while still allowing webpack EnvironmentPlugin
 * to inline direct `process.env.X` references at build time.
 */
var readEnv = function (getter) {
    try {
        return getter();
    }
    catch (_error) {
        return undefined;
    }
};
// Shared legacy env set used when scoped STATIC_/UPLOADS_ vars are absent.
var getSharedS3Env = function () { return ({
    accessURL: readEnv(function () { return process.env.S3_CDN_URL; }),
    endpoint: readEnv(function () { return process.env.S3_BUCKET_ENDPOINT; }),
    bucketName: readEnv(function () { return process.env.S3_FILES_BUCKET_NAME; }),
}); };
// Returns the first defined, non-empty value from a fallback chain.
var firstNonEmpty = function () {
    var e_1, _a;
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    try {
        for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
            var value = values_1_1.value;
            if (value !== undefined && value !== null && value !== '') {
                return value;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return undefined;
};
// Builds versioned/static URL segments without duplicate or broken slashes.
var appendPathSegment = function (base, segment) {
    var cleanBase = trimTrailingSlash(base || '');
    var cleanSegment = trimSlashes(segment || '');
    if (!cleanBase) {
        return undefined;
    }
    if (!cleanSegment || cleanBase.endsWith("/".concat(cleanSegment))) {
        return cleanBase;
    }
    return "".concat(cleanBase, "/").concat(cleanSegment);
};
// Normalizes the final public access URL from either direct accessURL or endpoint+bucket.
var getAccessURL = function (_a) {
    var accessURL = _a.accessURL, endpoint = _a.endpoint, bucketName = _a.bucketName;
    if (accessURL) {
        return trimTrailingSlash(accessURL);
    }
    if (endpoint && bucketName) {
        return "".concat(trimTrailingSlash(endpoint), "/").concat(bucketName);
    }
    return trimTrailingSlash(endpoint);
};
/**
 * Access URL for user-uploaded files. This intentionally prefers upload-specific
 * env vars, then falls back to legacy shared env vars.
 */
var getAccessURLUploadsStore = function () {
    var shared = getSharedS3Env();
    var uploadsAccessURL = readEnv(function () { return process.env.UPLOADS_ACCESS_URL; });
    var uploadsEndpoint = readEnv(function () { return process.env.UPLOADS_S3_BUCKET_ENDPOINT; });
    var uploadsBucketName = readEnv(function () { return process.env.UPLOADS_S3_FILES_BUCKET_NAME; });
    return getAccessURL({
        accessURL: firstNonEmpty(uploadsAccessURL, shared.accessURL),
        endpoint: firstNonEmpty(uploadsEndpoint, shared.endpoint),
        bucketName: firstNonEmpty(uploadsBucketName, shared.bucketName),
    });
};
exports.getAccessURLUploadsStore = getAccessURLUploadsStore;
/**
 * Access URL for static web assets (bundles/images/root). This can be independent
 * from uploads and is expected to include the release version when configured by
 * app storage bootstrap (for example ".../4.1.1").
 */
var getAccessURLStaticStore = function () {
    var shared = getSharedS3Env();
    var uploadsEndpoint = readEnv(function () { return process.env.UPLOADS_S3_BUCKET_ENDPOINT; });
    var uploadsBucketName = readEnv(function () { return process.env.UPLOADS_S3_FILES_BUCKET_NAME; });
    var staticAccessURL = readEnv(function () { return process.env.STATIC_ACCESS_URL; });
    var version = readEnv(function () { return process.env.VERSION; });
    var staticEndpoint = readEnv(function () { return process.env.STATIC_S3_BUCKET_ENDPOINT; });
    var staticBucketName = readEnv(function () { return process.env.STATIC_S3_FILES_BUCKET_NAME; });
    // If STATIC_ACCESS_URL is not set, derive it from shared CDN + VERSION.
    // This keeps static assets versioned even with legacy env-only configs.
    var fallbackStaticAccessURL = appendPathSegment(shared.accessURL, version);
    return getAccessURL({
        accessURL: firstNonEmpty(staticAccessURL, fallbackStaticAccessURL),
        endpoint: firstNonEmpty(staticEndpoint, uploadsEndpoint, shared.endpoint),
        bucketName: firstNonEmpty(staticBucketName, uploadsBucketName, shared.bucketName),
    });
};
exports.getAccessURLStaticStore = getAccessURLStaticStore;
/**
 * Backward-compatible alias for existing imports.
 */
var getAccessURLS3FileStore = function () { return (0, exports.getAccessURLUploadsStore)(); };
exports.getAccessURLS3FileStore = getAccessURLS3FileStore;
//# sourceMappingURL=accessUrl.js.map