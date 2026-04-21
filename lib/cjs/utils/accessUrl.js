"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessURLS3FileStore = exports.getAccessURLStaticStore = exports.getAccessURLUploadsStore = void 0;
const trimTrailingSlash = (value = '') => value.replace(/\/+$/g, '');
const trimSlashes = (value = '') => value.replace(/^\/+|\/+$/g, '');
/**
 * Read env vars in a browser-safe way while still allowing webpack EnvironmentPlugin
 * to inline direct `process.env.X` references at build time.
 */
const readEnv = (getter) => {
    try {
        return getter();
    }
    catch (_error) {
        return undefined;
    }
};
// Shared legacy env set used when scoped STATIC_/UPLOADS_ vars are absent.
const getSharedS3Env = () => ({
    accessURL: readEnv(() => process.env.S3_CDN_URL),
    endpoint: readEnv(() => process.env.S3_BUCKET_ENDPOINT),
    bucketName: readEnv(() => process.env.S3_FILES_BUCKET_NAME),
});
// Returns the first defined, non-empty value from a fallback chain.
const firstNonEmpty = (...values) => {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }
    return undefined;
};
// Builds versioned/static URL segments without duplicate or broken slashes.
const appendPathSegment = (base, segment) => {
    const cleanBase = trimTrailingSlash(base || '');
    const cleanSegment = trimSlashes(segment || '');
    if (!cleanBase) {
        return undefined;
    }
    if (!cleanSegment || cleanBase.endsWith(`/${cleanSegment}`)) {
        return cleanBase;
    }
    return `${cleanBase}/${cleanSegment}`;
};
// Normalizes the final public access URL from either direct accessURL or endpoint+bucket.
const getAccessURL = ({ accessURL, endpoint, bucketName, }) => {
    if (accessURL) {
        return trimTrailingSlash(accessURL);
    }
    if (endpoint && bucketName) {
        return `${trimTrailingSlash(endpoint)}/${bucketName}`;
    }
    return trimTrailingSlash(endpoint);
};
/**
 * Access URL for user-uploaded files. This intentionally prefers upload-specific
 * env vars, then falls back to legacy shared env vars.
 */
const getAccessURLUploadsStore = () => {
    const shared = getSharedS3Env();
    const uploadsAccessURL = readEnv(() => process.env.UPLOADS_ACCESS_URL);
    const uploadsEndpoint = readEnv(() => process.env.UPLOADS_S3_BUCKET_ENDPOINT);
    const uploadsBucketName = readEnv(() => process.env.UPLOADS_S3_FILES_BUCKET_NAME);
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
const getAccessURLStaticStore = () => {
    const shared = getSharedS3Env();
    const uploadsEndpoint = readEnv(() => process.env.UPLOADS_S3_BUCKET_ENDPOINT);
    const uploadsBucketName = readEnv(() => process.env.UPLOADS_S3_FILES_BUCKET_NAME);
    const staticAccessURL = readEnv(() => process.env.STATIC_ACCESS_URL);
    const version = readEnv(() => process.env.VERSION);
    const staticEndpoint = readEnv(() => process.env.STATIC_S3_BUCKET_ENDPOINT);
    const staticBucketName = readEnv(() => process.env.STATIC_S3_FILES_BUCKET_NAME);
    // If STATIC_ACCESS_URL is not set, derive it from shared CDN + VERSION.
    // This keeps static assets versioned even with legacy env-only configs.
    const fallbackStaticAccessURL = appendPathSegment(shared.accessURL, version);
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
const getAccessURLS3FileStore = () => (0, exports.getAccessURLUploadsStore)();
exports.getAccessURLS3FileStore = getAccessURLS3FileStore;
//# sourceMappingURL=accessUrl.js.map