/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { IFileStore } from '@_linked/core/interfaces/IFileStore';
import { Shape } from '@_linked/core/shapes/Shape';
import { type S3ClientConfigInput } from './S3Bucket.js';
import type { Readable } from 'stream';
export interface S3FileStoreConfig {
    bucketName?: string;
    accessURL?: string;
    prefix?: string;
    clientConfig?: S3ClientConfigInput;
}
export declare class S3FileStore extends Shape implements IFileStore {
    static targetClass: import("@_linked/core/utils/NodeReference.js").NodeReferenceValue;
    label: string;
    private _bucket;
    private readonly config;
    readonly accessURL: string;
    constructor(n: string | {
        id: string;
    }, config?: S3FileStoreConfig);
    private get bucket();
    private resolveBucketName;
    private resolveAccessURL;
    private get prefix();
    private normalizePath;
    private applyPrefix;
    private stripPrefix;
    /**
     * List all files in the bucket
     * @param recursive Whether to list files recursively or just the top-level files
     * @returns A list of file paths, relative to the endpoint
     * @todo Think about taking an options parameter instead of positional args
     * @todo Take a path parameter to list files in a subdirectory
     */
    listFiles(prefix?: string): Promise<string[]>;
    /**
     * Save a file to the bucket
     * @param filePath The path to save the file to, relative to the endpoint
     * @param fileContent The contents of the file as a buffer
     * @returns The public URL of the file
     */
    saveFile(filePath: string, fileContent: string | Uint8Array | Buffer | Readable, mimeType?: string, preventDuplicate?: boolean): Promise<string>;
    /**
     * Get a file from the bucket
     * @param filePath The path of the file to get, relative to the endpoint
     * @returns The contents of the file as a buffer
     */
    getFile(filePath: string): Promise<Buffer | null>;
    /**
     * Delete a file from the bucket
     * @param filePath The path of the file to delete, relative to the endpoint
     */
    deleteFile(filePath: string): Promise<void>;
    /**
     * Check if a file exists in the bucket
     * @param filePath The path of the file to check, relative to the endpoint
     * @returns Whether the file exists
     */
    fileExists(filePath: string): Promise<boolean>;
}
