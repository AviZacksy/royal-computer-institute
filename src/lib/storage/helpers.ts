import { randomUUID } from "crypto";
import path from "path";
import { getStorageProvider, buildStorageKey, type StorageBucket } from "./index";

export type UploadFileInput = {
  instituteId: string;
  bucket: StorageBucket;
  category: string;
  file: File;
};

export async function uploadFile(input: UploadFileInput) {
  const ext = path.extname(input.file.name) || guessExt(input.file.type);
  const filename = `${randomUUID()}${ext}`;
  const key = buildStorageKey(input.instituteId, input.category, filename);
  const buffer = Buffer.from(await input.file.arrayBuffer());

  const stored = await getStorageProvider().upload({
    bucket: input.bucket,
    key,
    body: buffer,
    contentType: input.file.type || "application/octet-stream",
  });

  return stored;
}

export async function getFileUrl(bucket: StorageBucket, key: string) {
  return getStorageProvider().getSignedUrl(bucket, key);
}

function guessExt(mime: string) {
  if (mime === "application/pdf") return ".pdf";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  if (mime.startsWith("image/")) return ".jpg";
  return "";
}
