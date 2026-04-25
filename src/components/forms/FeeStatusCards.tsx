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
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-royal">
                  Paid
                </p>
                <p className="mt-1 text-sm text-muted">
                  Last receipt: #RCI-0001 (demo)
                </p>
              </div>
              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                Paid
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:gap-2">
              <Button
                variant="outline"
                onClick={() => setNotice("Receipt download will be available in the full system.")}
                className="w-full sm:w-auto"
              >
                Download Receipt
              </Button>
              <Button
                variant="secondary"
                onClick={() => setNotice("Receipt details will be available in the full system.")}
                className="w-full sm:w-auto"
              >
                View Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gold/35 bg-section">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-royal">
                  Pending
                </p>
                <p className="mt-1 text-sm text-muted">
                  Next due: ₹— (demo)
                </p>
              </div>
              <span className="rounded-full bg-gold-dark px-3 py-1 text-xs font-semibold text-royal">
                Pending
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap sm:gap-2">
              <Button
                onClick={() => setNotice("Online payment will be available in the full system.")}
                className="w-full sm:w-auto"
              >
                Pay Now
              </Button>
              <Button
                variant="outline"
                onClick={() => setNotice("Fee breakdown will be available in the full system.")}
                className="w-full sm:w-auto"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {notice ? (
        <div className="mt-6 rounded-[var(--radius-card)] border border-gold/20 bg-section p-4 text-sm font-extrabold text-royal">
          {notice || MSG}
        </div>
      ) : (
        <div className="mt-6 rounded-[var(--radius-card)] border border-gold/20 bg-section p-4 text-sm font-semibold text-muted">
          Click any button to see the demo message.
        </div>
      )}
    </div>
  );
}

