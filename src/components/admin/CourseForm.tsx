"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import { saveCourseAction } from "@/actions/admin/courses";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export type CourseFormValues = {
  id?: string;
  name: string;
  description: string;
  syllabus?: string | null;
  eligibility?: string | null;
  careerScope?: string | null;
  duration: string;
  totalFee: number;
  actualFee: number;
  installmentFee: number;
  oneTimeFee: number;
  imageUrl?: string | null;
  imagePath?: string | null;
  isActive: boolean;
  isEnquiryEnabled: boolean;
};

export function CourseForm({ initial }: { initial?: CourseFormValues }) {
  const [state, action, pending] = useActionState(saveCourseAction, null as ActionState);
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    if (state?.success && !isEdit) {
      const form = document.getElementById("course-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state?.success, isEdit]);

  return (
    <Card className="p-5">
      <p className="mb-4 font-extrabold text-[var(--ui-primary)]">
        {isEdit ? "Edit course" : "Add course"}
      </p>
      <form id="course-form" action={action} className="grid gap-4 sm:grid-cols-2">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <Field label="Title" htmlFor="name">
          <Input id="name" name="name" required defaultValue={initial?.name} />
        </Field>
        <Field label="Duration" htmlFor="duration">
          <Input id="duration" name="duration" required placeholder="e.g. 3 MONTH" defaultValue={initial?.duration} />
        </Field>
        <Field label="Actual Fee (Rs.)" htmlFor="actualFee">
          <Input id="actualFee" name="actualFee" type="number" min={0} required defaultValue={initial?.actualFee ?? initial?.totalFee ?? 0} />
        </Field>
        <Field label="Installment Fee (Rs.)" htmlFor="installmentFee">
          <Input id="installmentFee" name="installmentFee" type="number" min={0} required defaultValue={initial?.installmentFee ?? initial?.totalFee ?? 0} />
        </Field>
        <Field label="One Time Fee (Rs.)" htmlFor="oneTimeFee">
          <Input id="oneTimeFee" name="oneTimeFee" type="number" min={0} required defaultValue={initial?.oneTimeFee ?? initial?.totalFee ?? 0} />
        </Field>
        <Field label="Status" htmlFor="isActive">
          <Select id="isActive" name="isActive" defaultValue={initial?.isActive === false ? "false" : "true"}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </Field>
        <Field label="Enquiry Availability" htmlFor="isEnquiryEnabled">
          <Select id="isEnquiryEnabled" name="isEnquiryEnabled" defaultValue={initial?.isEnquiryEnabled === false ? "false" : "true"}>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </Select>
        </Field>
        <Field label="Fallback Image Path" htmlFor="imagePath">
          <Input id="imagePath" name="imagePath" placeholder="/courses/adca.png" defaultValue={initial?.imagePath ?? ""} />
        </Field>
        <Field label="Upload Course Image" htmlFor="courseImage">
          <Input id="courseImage" name="courseImage" type="file" accept="image/*" />
        </Field>
        {initial?.imageUrl ? (
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-semibold text-[var(--ui-text)]">Current image</p>
            <div className="flex flex-wrap items-center gap-4">
              <Image
                src={initial.imageUrl}
                alt={initial.name}
                width={144}
                height={96}
                unoptimized={initial.imageUrl.startsWith("http")}
                className="h-24 w-36 rounded-md border border-[var(--ui-border)] object-cover"
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-red-700">
                <input type="checkbox" name="removeImage" value="true" className="h-4 w-4" />
                Remove course image
              </label>
            </div>
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <Field label="Description" htmlFor="description">
            <Textarea id="description" name="description" required rows={3} defaultValue={initial?.description} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Syllabus" htmlFor="syllabus">
            <Textarea
              id="syllabus"
              name="syllabus"
              rows={6}
              placeholder="Paste the client-provided syllabus here. Leave blank if not provided yet."
              defaultValue={initial?.syllabus ?? ""}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Eligibility" htmlFor="eligibility">
            <Textarea
              id="eligibility"
              name="eligibility"
              rows={3}
              placeholder="Paste eligibility details here. Leave blank if not provided yet."
              defaultValue={initial?.eligibility ?? ""}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Career Scope" htmlFor="careerScope">
            <Textarea
              id="careerScope"
              name="careerScope"
              rows={4}
              placeholder="Paste career scope details here. Leave blank if not provided yet."
              defaultValue={initial?.careerScope ?? ""}
            />
          </Field>
        </div>
        {state?.error ? (
          <p className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        ) : null}
        {state?.success ? (
          <p className="sm:col-span-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{state.success}</p>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : isEdit ? "Update course" : "Add course"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
