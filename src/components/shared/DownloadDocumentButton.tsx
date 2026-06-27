"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";
import { getDocumentUrlAction } from "@/actions/admin/documents";
import { Button } from "@/components/ui/Button";

export function DownloadDocumentButton({
  storageKey,
  label,
  filename,
  getUrl,
}: {
  storageKey: string;
  label?: string;
  filename?: string;
  /** Override the server action used to resolve the signed URL (defaults to documents bucket). */
  getUrl?: (key: string) => Promise<string>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    startTransition(async () => {
      try {
        const resolver = getUrl ?? getDocumentUrlAction;
        const url = await resolver(storageKey);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename ?? "document.pdf";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        setError("Failed to get download link");
      }
    });
  };

  return (
    <div>
      <Button
        onClick={handleDownload}
        disabled={isPending}
        variant="outline"
        className="gap-2 text-xs"
      >
        <Download className="h-3.5 w-3.5" />
        {isPending ? "Preparing..." : (label ?? "Download")}
      </Button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
