import { LocalStorageProvider } from "./local";
import { SupabaseStorageProvider } from "./supabase";
import type { StorageProvider } from "./types";

export * from "./types";

let provider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (provider) return provider;

  const mode = process.env.STORAGE_PROVIDER ?? "auto";

  if (mode === "supabase" || (mode === "auto" && process.env.SUPABASE_URL)) {
    provider = new SupabaseStorageProvider();
    return provider;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Supabase storage is required in production. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and STORAGE_PROVIDER=supabase.",
    );
  }

  provider = new LocalStorageProvider();
  return provider;
}

/** Reset provider (tests only). */
export function resetStorageProvider() {
  provider = null;
}

export { uploadFile, getFileUrl } from "./helpers";
