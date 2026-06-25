"use client";

import { useActionState } from "react";
import { updateEnquiryStatusAction } from "@/actions/admin/enquiries";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Input";

export function EnquiryStatusForm({
  enquiryId,
  currentStatus,
}: {
  enquiryId: string;
  currentStatus: string;
}) {
  const [state, action, pending] = useActionState(updateEnquiryStatusAction, null as ActionState);

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="enquiryId" value={enquiryId} />
      <Field label="Status" htmlFor={`status-${enquiryId}`}>
        <Select
          id={`status-${enquiryId}`}
          name="status"
          defaultValue={currentStatus === "CONTACTED" ? "CONTACTED" : "NEW"}
          className="min-w-[140px]"
        >
          <option value="NEW">Pending</option>
          <option value="CONTACTED">Contacted</option>
        </Select>
      </Field>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Update"}
      </Button>
      {state?.error ? <p className="w-full text-xs text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="w-full text-xs text-green-700">{state.success}</p> : null}
    </form>
  );
}
