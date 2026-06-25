import { mkdir, writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import type { StorageBucket, StorageProvider, StoredObject, UploadInput } from "./types";

const LOCAL_ROOT = path.join(process.cwd(), ".storage-dev");

/**
 * Local filesystem provider for development when Supabase is not configured.
 * Not for production — mirrors the StorageProvider interface only.
 */
export class LocalStorageProvider implements StorageProvider {
  private root(bucket: StorageBucket) {
    return path.join(LOCAL_ROOT, bucket);
  }

  private fullPath(bucket: StorageBucket, key: string) {
    const normalized = key.replace(/\\/g, "/");
    if (normalized.includes("..")) throw new Error("Invalid storage key");
    return path.join(this.root(bucket), normalized);
  }

  async upload(input: UploadInput): Promise<StoredObject> {
    const dest = this.fullPath(input.bucket, input.key);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, input.body);

    return {
      bucket: input.bucket,
      key: input.key,
      contentType: input.contentType,
      size: input.body.byteLength,
    };
  }

  async getSignedUrl(bucket: StorageBucket, key: string): Promise<string> {
    // Dev-only: serve via internal API route (added in documents module).
    const encoded = encodeURIComponent(`${bucket}/${key}`);
    return `/api/storage/${encoded}`;
  }

  async delete(bucket: StorageBucket, key: string): Promise<void> {
    try {
      await unlink(this.fullPath(bucket, key));
    } catch {
      // ignore missing files in dev
    }
  }

  async read(bucket: StorageBucket, key: string): Promise<Buffer> {
    return readFile(this.fullPath(bucket, key));
  }
}
