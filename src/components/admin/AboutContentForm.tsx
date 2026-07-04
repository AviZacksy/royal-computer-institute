"use client";

import { useActionState } from "react";
import Image from "next/image";
import { saveAboutContentAction } from "@/actions/admin/about";
import type { ActionState } from "@/actions/admin/types";
import type { AboutContent } from "@/lib/public-content";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";

export function AboutContentForm({ initial }: { initial: AboutContent }) {
  const [state, action, pending] = useActionState(saveAboutContentAction, null as ActionState);
  const sectionSlots = [...initial.sections];
  while (sectionSlots.length < 6) sectionSlots.push({ title: "", description: "" });

  return (
    <Card className="p-5">
      <form action={action} className="grid gap-4 sm:grid-cols-2">
        <Field label="About Title" htmlFor="title">
          <Input id="title" name="title" required defaultValue={initial.title} />
        </Field>
        <Field label="Fallback Image Path" htmlFor="imagePath">
          <Input id="imagePath" name="imagePath" placeholder="/about/Director.jpeg" defaultValue={initial.imagePath ?? ""} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="About Description" htmlFor="description">
            <Textarea id="description" name="description" required rows={3} defaultValue={initial.description} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Institute Introduction" htmlFor="introduction">
            <Textarea id="introduction" name="introduction" required rows={5} defaultValue={initial.introduction} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Mission Text" htmlFor="mission">
            <Textarea id="mission" name="mission" required rows={5} defaultValue={initial.mission} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Vision Text" htmlFor="vision">
            <Textarea id="vision" name="vision" required rows={4} defaultValue={initial.vision} />
          </Field>
        </div>
        <Field label="Upload About Image" htmlFor="aboutImage">
          <Input id="aboutImage" name="aboutImage" type="file" accept="image/*" />
        </Field>
        {initial.imageUrl ? (
          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--ui-text)]">Current image</p>
            <div className="flex flex-wrap items-center gap-4">
              <Image
                src={initial.imageUrl}
                alt={initial.title}
                width={144}
                height={96}
                unoptimized={initial.imageUrl.startsWith("http") || initial.imageUrl.startsWith("/api/")}
                className="h-24 w-36 rounded-md border border-[var(--ui-border)] object-cover"
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-red-700">
                <input type="checkbox" name="removeImage" value="true" className="h-4 w-4" />
                Remove image
              </label>
            </div>
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <p className="mb-3 text-sm font-extrabold text-[var(--ui-primary)]">Optional Facility Sections</p>
          <div className="grid gap-4">
            {sectionSlots.map((section, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                <Field label={`Section ${index + 1} Title`} htmlFor={`sectionTitle-${index}`}>
                  <Input id={`sectionTitle-${index}`} name="sectionTitle" defaultValue={section.title} />
                </Field>
                <Field label={`Section ${index + 1} Description`} htmlFor={`sectionDescription-${index}`}>
                  <Input id={`sectionDescription-${index}`} name="sectionDescription" defaultValue={section.description} />
                </Field>
              </div>
            ))}
          </div>
        </div>
        {state?.error ? (
          <p className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        ) : null}
        {state?.success ? (
          <p className="sm:col-span-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{state.success}</p>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save About Content"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
