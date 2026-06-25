export const STORAGE_BUCKETS = {
  notes: "notes",
  payments: "payments",
  gallery: "gallery",
  documents: "documents",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export type StoredObject = {
  bucket: StorageBucket;
  key: string;
  contentType: string;
  size: number;
};

export type UploadInput = {
  bucket: StorageBucket;
  key: string;
  body: Buffer | Uint8Array;
  contentType: string;
  upsert?: boolean;
};

export interface StorageProvider {
  upload(input: UploadInput): Promise<StoredObject>;
  getSignedUrl(bucket: StorageBucket, key: string, expiresInSeconds?: number): Promise<string>;
  delete(bucket: StorageBucket, key: string): Promise<void>;
}

/** Canonical key format: `{instituteId}/{category}/{uuid}.{ext}` */
export function buildStorageKey(
  instituteId: string,
  category: string,
  filename: string,
): string {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${instituteId}/${category}/${safeName}`;
}
