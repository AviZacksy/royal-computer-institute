import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { StorageBucket, StorageProvider, StoredObject, UploadInput } from "./types";

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for Supabase storage.");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export class SupabaseStorageProvider implements StorageProvider {
  private client: SupabaseClient;

  constructor(client?: SupabaseClient) {
    this.client = client ?? getSupabaseAdmin();
  }

  async upload(input: UploadInput): Promise<StoredObject> {
    const { error } = await this.client.storage.from(input.bucket).upload(input.key, input.body, {
      contentType: input.contentType,
      upsert: input.upsert ?? false,
    });
    if (error) throw new Error(`Storage upload failed: ${error.message}`);

    return {
      bucket: input.bucket,
      key: input.key,
      contentType: input.contentType,
      size: input.body.byteLength,
    };
  }

  async getSignedUrl(bucket: StorageBucket, key: string, expiresInSeconds = 3600): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(key, expiresInSeconds);
    if (error || !data?.signedUrl) {
      throw new Error(`Storage signed URL failed: ${error?.message ?? "unknown error"}`);
    }
    return data.signedUrl;
  }

  async read(bucket: StorageBucket, key: string): Promise<Buffer> {
    const { data, error } = await this.client.storage.from(bucket).download(key);
    if (error || !data) {
      throw new Error(`Storage download failed: ${error?.message ?? "unknown error"}`);
    }
    return Buffer.from(await data.arrayBuffer());
  }

  async delete(bucket: StorageBucket, key: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove([key]);
    if (error) throw new Error(`Storage delete failed: ${error.message}`);
  }
}
