"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const MSG = "This feature will be activated in the full system.";

export function FeeStatusCards() {
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-emerald-200 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Paid
                </p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  Last receipt: #RCI-0001 (demo)
                </p>
              </div>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                Paid
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setNotice("Receipt download will be available in the full system.")}
              >
                Download Receipt
              </Button>
              <Button
                variant="secondary"
                onClick={() => setNotice("Receipt details will be available in the full system.")}
              >
                View Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/10">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Pending
                </p>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                  Next due: ₹— (demo)
                </p>
              </div>
              <span className="rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
                Pending
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => setNotice("Online payment will be available in the full system.")}>
                Pay Now
              </Button>
              <Button
                variant="outline"
                onClick={() => setNotice("Fee breakdown will be available in the full system.")}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {notice ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
          {notice || MSG}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
          Click any button to see the demo message.
        </div>
      )}
    </div>
  );
}

