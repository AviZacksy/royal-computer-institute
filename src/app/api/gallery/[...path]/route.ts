import { NextRequest, NextResponse } from "next/server";
import { LocalStorageProvider } from "@/lib/storage/local";
import { STORAGE_BUCKETS } from "@/lib/storage/types";

/** Public read-only access to gallery bucket files (local dev). */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const key = segments.join("/");
  if (!key || key.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const local = new LocalStorageProvider();
    const data = await local.read(STORAGE_BUCKETS.gallery, key);
    const ext = key.split(".").pop()?.toLowerCase();
    const type =
      ext === "mp4" || ext === "webm"
        ? "video/mp4"
        : ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/jpeg";

    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
