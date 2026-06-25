import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { LocalStorageProvider } from "@/lib/storage/local";
import { STORAGE_BUCKETS, type StorageBucket } from "@/lib/storage/types";

function parseStoragePath(encoded: string): { bucket: StorageBucket; key: string } | null {
  const decoded = decodeURIComponent(encoded);
  const slash = decoded.indexOf("/");
  if (slash <= 0) return null;

  const bucket = decoded.slice(0, slash) as StorageBucket;
  const key = decoded.slice(slash + 1);
  if (!Object.values(STORAGE_BUCKETS).includes(bucket) || !key || key.includes("..")) {
    return null;
  }
  return { bucket, key };
}

/** Dev-only route used by LocalStorageProvider.getSignedUrl(). */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  if (process.env.NODE_ENV === "production" && process.env.STORAGE_PROVIDER !== "local") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path: segments } = await params;
  if (!segments?.length) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  const parsed = parseStoragePath(segments.join("/"));
  if (!parsed) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const local = new LocalStorageProvider();
    const data = await local.read(parsed.bucket, parsed.key);
    const ext = parsed.key.split(".").pop()?.toLowerCase();
    const type =
      ext === "pdf"
        ? "application/pdf"
        : ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/jpeg";

    return new NextResponse(new Uint8Array(data), {
      headers: { "Content-Type": type, "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
