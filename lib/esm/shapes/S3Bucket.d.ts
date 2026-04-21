import { DeleteObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommandInput, PutObjectCommandOutput } from '@aws-sdk/client-s3/dist-types/commands/PutObjectCommand';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { Shape } from '@_linked/core/shapes/Shape';
export interface S3ClientConfigInput {
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    region?: string;
}
export declare const endpoint: string;
/**
 * Builds an S3 client from explicit config, falling back to legacy env vars.
 * This enables multiple S3 stores in one process with independent credentials/endpoints.
 */
export declare const createS3Client: (config?: S3ClientConfigInput) => S3Client;
/**
 * Legacy singleton exported for backward compatibility. New code should prefer
 * per-instance clients by passing config into S3Bucket/S3FileStore.
 */
export declare const s3Client: S3Client;
export declare class S3Bucket extends Shape {
    static targetClass: import("@_linked/core/utils/NodeReference.js").NodeReferenceValue;
    protected _client: S3Client;
    label: string;
    private ensureKeyPromise;
    constructor(n?: string | {
        id: string;
    }, clientConfig?: S3ClientConfigInput);
    get endpoint(): string;
    /**
     * Delete an object from the bucket.
     * @param key The key of the object to delete
     * @param options Additional options to pass to the DeleteObjectCommand
     * @returns The response from the DeleteObjectCommand
     * @todo Batch delete, see https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html
     */
    deleteObject(key: string, options?: Omit<DeleteObjectCommandInput, 'Key' | 'Bucket'>): Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
    copyObject(sourceKey: string, destinationKey: string, options?: Omit<PutObjectCommandInput, 'Key' | 'Bucket'>): Promise<boolean>;
    /**
     * Put an object into the bucket.
     *
     * @param key The key of the object to PUT (i.e. file name)
     * @param value The value of the object to PUT (i.e. file contents)
     * @param options Additional options to pass to the PutObjectCommand
     * @returns The response from the PutObjectCommand
     */
    putObject(key: string, value: StreamingBlobPayloadInputTypes, options?: Omit<PutObjectCommandInput, 'Body' | 'Key' | 'Bucket'>): Promise<PutObjectCommandOutput>;
    /**
     * Get a list of all object keys in the bucket.
     * Important to note that only a maximum 1000 keys will be returned.
     *
     * @param prefix The prefix to search for in the bucket. This can be a folder or the beginning of a file name.
     * @returns A list of all object keys in the bucket
     * @todo Recursive search within directories
     * @todo Implement pagination
     */
    getAllObjectKeys(prefix?: string): Promise<string[]>;
    /**
     * Get the contents of an object in the bucket.
     * @param key The key of the object to get
     * @returns The contents of the object as a string
     */
    getObject(key: string): Promise<string>;
    /**
     * Ensure that the given key exists in the bucket, the file contents
     * will be an empty json object.
     *
     * @param key The key to insert if it does not exist
     * @returns The promise that will resolve when the key exists
     */
    ensureKeyExists(key: string): Promise<string | void>;
    private _ensureKeyExists;
    private keyExists;
    /**
     * Create the bucket if it does not exist.
     * @returns The promise that will resolve when the bucket exists
     */
    createBucket(): Promise<import("@aws-sdk/client-s3").CreateBucketCommandOutput>;
}
