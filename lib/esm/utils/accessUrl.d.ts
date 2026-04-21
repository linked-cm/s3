/**
 * Access URL for user-uploaded files. This intentionally prefers upload-specific
 * env vars, then falls back to legacy shared env vars.
 */
export declare const getAccessURLUploadsStore: () => string;
/**
 * Access URL for static web assets (bundles/images/root). This can be independent
 * from uploads and is expected to include the release version when configured by
 * app storage bootstrap (for example ".../4.1.1").
 */
export declare const getAccessURLStaticStore: () => string;
/**
 * Backward-compatible alias for existing imports.
 */
export declare const getAccessURLS3FileStore: () => string;
