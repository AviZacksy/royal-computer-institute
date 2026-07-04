"use client";

import Link from "next/link";
import { useActionState, useRef, useState, useEffect } from "react";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Check, UploadCloud, ChevronRight, ChevronLeft, Save, GraduationCap, User, FileText, MapPin, CheckCircle, AlertCircle } from "lucide-react";

type CourseOption = { id: string; name: string };
type RegisterState = {
  error?: string;
  success?: string;
  admissionNumber?: string;
} | null;

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Course Details", icon: GraduationCap },
  { id: 3, title: "Qualification", icon: FileText },
  { id: 4, title: "Address", icon: MapPin },
  { id: 5, title: "Documents", icon: UploadCloud },
  { id: 6, title: "Review", icon: CheckCircle },
];

export function StudentAdmissionForm({ courses }: { courses: CourseOption[] }) {
  const [step, setStep] = useState(1);
  const [summary, setSummary] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLFormElement>(null);
  
  const [state, action, pending] = useActionState(
    async (_prev: RegisterState, formData: FormData) => {
      const result = await registerAction(formData);
      return result ?? null;
    },
    null,
  );

  // Restore draft from local storage on mount
  useEffect(() => {
    const draft = localStorage.getItem("admission_draft");
    if (draft && formRef.current) {
      try {
        const parsed = JSON.parse(draft);
        setSummary(parsed);
        // We populate text fields, but file inputs cannot be restored for security reasons.
        Object.keys(parsed).forEach(key => {
          const el = formRef.current?.elements.namedItem(key) as HTMLInputElement;
          if (el && el.type !== "file") {
            el.value = parsed[key];
          }
        });
      } catch(e) {}
    }
  }, []);

  const handleInput = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    setSummary(data);
  };

  const saveDraft = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    // Remove files from draft
    delete data.studentPhoto;
    delete data.marksheet;
    delete data.aadhaarCard;
    delete data.signature;
    localStorage.setItem("admission_draft", JSON.stringify(data));
    alert("Draft saved locally! You can return later to complete it.");
  };

  const handleNext = () => {
    const stepEl = document.getElementById(`step-${step}`);
    if (!stepEl) return;
    
    // Validate current step
    const inputs = stepEl.querySelectorAll("input, select, textarea");
    let isValid = true;
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i] as HTMLInputElement;
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
        break;
      }
    }
    
    // Custom validation for passwords on step 2
    if (step === 2 && isValid) {
      const pwd = (document.getElementById("password") as HTMLInputElement)?.value;
      const confirm = (document.getElementById("confirmPassword") as HTMLInputElement)?.value;
      if (pwd !== confirm) {
        alert("Passwords do not match!");
        isValid = false;
      }
    }

    if (isValid) {
      setStep((s) => Math.min(s + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (state?.success) {
    // Clear draft on success
    localStorage.removeItem("admission_draft");
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="font-display text-3xl font-extrabold text-[var(--ui-primary)] mb-4">{state.success}</h2>
        <div className="rounded-xl bg-slate-50 p-6 border border-slate-100 mb-8">
          <p className="text-sm text-[var(--ui-muted)] uppercase tracking-wider font-bold mb-1">Admission Number</p>
          <p className="font-display text-4xl font-black text-emerald-600 tracking-tight">{state.admissionNumber}</p>
        </div>
        <p className="text-lg text-[var(--ui-muted)] mb-8">
          Your admission request has been successfully submitted. Admin approval is required before you can access the student portal. Your printable admission form has been saved.
        </p>
        <Link
          href="/student-login"
          className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-[var(--ui-primary)] px-8 text-sm font-bold text-white transition hover:bg-[var(--ui-secondary)]"
        >
          Go to Student Login
        </Link>
      </div>
    );
  }

  const selectedCourse = courses.find((c) => c.id === summary.courseId)?.name || "Not selected";
  const progressPercent = Math.round(((step - 1) / (STEPS.length - 1)) * 100);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
      {/* Left Column: Form */}
      <div className="space-y-6">
        {/* Stepper */}
        <div className="rounded-2xl border border-[var(--ui-border)] bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2"></div>
            <div className="absolute left-0 top-1/2 h-1 bg-[var(--ui-secondary)] -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${isActive ? "border-[var(--ui-secondary)] bg-[var(--ui-secondary)] text-white shadow-md shadow-blue-500/20 scale-110" : isCompleted ? "border-[var(--ui-secondary)] bg-blue-50 text-[var(--ui-secondary)]" : "border-slate-200 bg-white text-slate-400"}`}>
                    {isCompleted ? <Check className="h-5 w-5 sm:h-6 sm:w-6" /> : <Icon className="h-5 w-5 sm:h-6 sm:w-6" />}
                  </div>
                  <span className={`hidden sm:block text-[10px] sm:text-xs font-bold ${isActive ? "text-[var(--ui-primary)]" : isCompleted ? "text-[var(--ui-secondary)]" : "text-slate-400"}`}>{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="border-[var(--ui-border)] shadow-xl shadow-slate-200/50">
          <CardContent className="p-6 sm:p-10">
            <form ref={formRef} action={action} onInput={handleInput} noValidate>
              
              {/* Step 1: Personal Details */}
              <div id="step-1" className={step === 1 ? "block space-y-8 animate-fade-in" : "hidden"}>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">Personal Details</h3>
                  <p className="text-[var(--ui-muted)] mt-1 text-sm sm:text-base">Enter your basic personal information exactly as it appears on your official documents.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Full Name" htmlFor="name">
                    <Input id="name" name="name" required autoComplete="name" placeholder="E.g. Rahul Kumar" />
                  </Field>
                  <Field label="Mobile Number" htmlFor="phone">
                    <Input id="phone" name="phone" inputMode="numeric" required autoComplete="tel" placeholder="10-digit mobile number" minLength={10} maxLength={10} />
                  </Field>
                  <Field label="Email ID" htmlFor="email">
                    <Input id="email" name="email" type="email" required autoComplete="email" placeholder="student@example.com" />
                  </Field>
                  <Field label="Gender" htmlFor="gender">
                    <Select id="gender" name="gender" required defaultValue="">
                      <option value="" disabled>Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </Field>
                  <Field label="Date of Birth" htmlFor="dateOfBirth">
                    <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                  </Field>
                  <Field label="Aadhaar Number" htmlFor="aadhaarNumber" hint="12-digit format">
                    <Input id="aadhaarNumber" name="aadhaarNumber" inputMode="numeric" maxLength={12} minLength={12} required placeholder="000000000000" />
                  </Field>
                  <Field label="Father's Name" htmlFor="fatherName">
                    <Input id="fatherName" name="fatherName" required placeholder="Full Name" />
                  </Field>
                  <Field label="Mother's Name" htmlFor="motherName">
                    <Input id="motherName" name="motherName" required placeholder="Full Name" />
                  </Field>
                </div>
              </div>

              {/* Step 2: Course Details */}
              <div id="step-2" className={step === 2 ? "block space-y-8 animate-fade-in" : "hidden"}>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">Course & Login Setup</h3>
                  <p className="text-[var(--ui-muted)] mt-1 text-sm sm:text-base">Select your desired program and set up your student portal credentials.</p>
                </div>
                <div className="grid gap-6">
                  <Field label="Program / Course Interested In" htmlFor="courseId">
                    <Select id="courseId" name="courseId" required defaultValue="" className="h-14 text-base">
                      <option value="" disabled>Select a course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <div className="mt-8 rounded-2xl bg-slate-50 p-6 border border-slate-200">
                  <h4 className="font-bold text-[var(--ui-primary)] mb-4 flex items-center gap-2"><User className="h-5 w-5 text-[var(--ui-secondary)]" /> Student Portal Login Setup</h4>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Set Password" htmlFor="password">
                      <Input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" placeholder="Min. 6 characters" />
                    </Field>
                    <Field label="Confirm Password" htmlFor="confirmPassword">
                      <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" placeholder="Confirm your password" />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Step 3: Qualification */}
              <div id="step-3" className={step === 3 ? "block space-y-8 animate-fade-in" : "hidden"}>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">Qualification</h3>
                  <p className="text-[var(--ui-muted)] mt-1 text-sm sm:text-base">Provide details of your educational background.</p>
                </div>
                <div className="grid gap-6">
                  <Field label="Highest Qualification" htmlFor="qualification" hint="e.g., 10th Passed, 12th Passed, B.A. Pursuing">
                    <Input id="qualification" name="qualification" required placeholder="Enter your highest qualification" className="h-14" />
                  </Field>
                </div>
              </div>

              {/* Step 4: Address */}
              <div id="step-4" className={step === 4 ? "block space-y-8 animate-fade-in" : "hidden"}>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">Address Details</h3>
                  <p className="text-[var(--ui-muted)] mt-1 text-sm sm:text-base">Provide your current and permanent residential address.</p>
                </div>
                <div className="grid gap-6">
                  <Field label="Permanent Address" htmlFor="permanentAddress">
                    <Textarea id="permanentAddress" name="permanentAddress" rows={4} required placeholder="House No, Street, Village/City, Pincode" />
                  </Field>
                  <Field label="Current/Local Address" htmlFor="currentAddress" hint="If same as permanent, you can copy it here.">
                    <Textarea id="currentAddress" name="currentAddress" rows={4} required placeholder="House No, Street, Village/City, Pincode" />
                  </Field>
                </div>
              </div>

              {/* Step 5: Documents */}
              <div id="step-5" className={step === 5 ? "block space-y-8 animate-fade-in" : "hidden"}>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">Document Upload</h3>
                  <p className="text-[var(--ui-muted)] mt-1 text-sm sm:text-base">Upload clear, scanned copies of required documents (Max 5MB each, Image or PDF).</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FileDropzone id="studentPhoto" label="Student Passport Photo" required />
                  <FileDropzone id="signature" label="Student Signature" required />
                  <FileDropzone id="aadhaarCard" label="Aadhaar Card" required />
                  <FileDropzone id="marksheet" label="Latest Marksheet" required />
                </div>
              </div>

              {/* Step 6: Review */}
              <div id="step-6" className={step === 6 ? "block space-y-8 animate-fade-in" : "hidden"}>
                <div>
                  <h3 className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">Review & Submit</h3>
                  <p className="text-[var(--ui-muted)] mt-1 text-sm sm:text-base">Please review all information before final submission.</p>
                </div>
                
                <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Name</p>
                      <p className="font-bold text-[var(--ui-primary)] mt-1">{summary.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Course</p>
                      <p className="font-bold text-[var(--ui-secondary)] mt-1">{selectedCourse}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Mobile</p>
                      <p className="font-bold text-[var(--ui-primary)] mt-1">{summary.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Email</p>
                      <p className="font-bold text-[var(--ui-primary)] mt-1">{summary.email || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Aadhaar</p>
                      <p className="font-bold text-[var(--ui-primary)] mt-1">{summary.aadhaarNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">DOB</p>
                      <p className="font-bold text-[var(--ui-primary)] mt-1">{summary.dateOfBirth || "-"}</p>
                    </div>
                  </div>
                </div>

                {state?.error ? (
                  <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>{state.error}</p>
                  </div>
                ) : null}
              </div>

              {/* Navigation Buttons */}
              <div className="mt-10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-8">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={handlePrev} className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                ) : (
                  <div></div> // Empty div for spacing if no back button
                )}
                
                <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3">
                  {step < STEPS.length ? (
                    <>
                      <Button type="button" variant="ghost" onClick={saveDraft} className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold text-[var(--ui-muted)] hover:text-[var(--ui-primary)]">
                        <Save className="mr-2 h-4 w-4" /> Save Draft
                      </Button>
                      <Button type="button" onClick={handleNext} className="w-full sm:w-auto h-12 px-10 rounded-xl font-bold bg-[var(--ui-primary)] hover:bg-[var(--ui-primary)]/90 shadow-lg shadow-[var(--ui-primary)]/20 hover:scale-105 transition-all">
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button type="submit" disabled={pending || courses.length === 0} className="w-full sm:w-auto h-14 px-12 rounded-xl font-extrabold text-lg bg-[var(--ui-secondary)] hover:bg-blue-700 shadow-xl shadow-[var(--ui-secondary)]/25 hover:scale-105 transition-all">
                      {pending ? "Submitting..." : "Submit Admission"}
                    </Button>
                  )}
                </div>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Summary Sidebar (Desktop Only) */}
      <div className="hidden lg:block relative">
        <div className="sticky top-28 rounded-3xl border border-[var(--ui-border)] bg-slate-50 p-6 shadow-sm">
          <h3 className="font-display text-lg font-black uppercase tracking-wider text-[var(--ui-primary)] mb-6 border-b border-slate-200 pb-4">
            Admission Summary
          </h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-[var(--ui-muted)] uppercase tracking-wide">Selected Program</p>
              <p className={`mt-1 font-bold ${selectedCourse === "Not selected" ? "text-slate-400" : "text-[var(--ui-secondary)] text-lg"}`}>
                {selectedCourse}
              </p>
            </div>
            
            <div>
              <p className="text-xs font-bold text-[var(--ui-muted)] uppercase tracking-wide">Student Name</p>
              <p className={`mt-1 font-bold ${!summary.name ? "text-slate-400" : "text-[var(--ui-primary)]"}`}>
                {summary.name || "Enter your name"}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-[var(--ui-muted)] uppercase tracking-wide">Mobile Number</p>
              <p className={`mt-1 font-bold ${!summary.phone ? "text-slate-400" : "text-[var(--ui-primary)]"}`}>
                {summary.phone || "---"}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-[var(--ui-muted)] uppercase tracking-wide">Progress</p>
                <p className="text-sm font-black text-[var(--ui-secondary)]">{progressPercent}%</p>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--ui-secondary)] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>

            <div className="bg-blue-50/80 rounded-xl p-4 mt-6 border border-blue-100">
              <p className="text-xs text-blue-800 font-semibold leading-relaxed">
                Need help with admission? Contact the institute directly for support with your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Drag and Drop File Input
function FileDropzone({ id, label, required, accept = "image/*,application/pdf" }: { id: string, label: string, required?: boolean, accept?: string }) {
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        setFileName("");
      } else {
        setFileName(file.name);
      }
    } else {
      setFileName("");
    }
  };

  return (
    <Field label={required ? `${label} *` : label} htmlFor={id}>
      <div 
        className={`group flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${fileName ? "border-emerald-400 bg-emerald-50" : "border-slate-300 bg-slate-50 hover:border-[var(--ui-secondary)] hover:bg-blue-50"}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-[var(--ui-secondary)]", "bg-blue-50"); }}
        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-[var(--ui-secondary)]", "bg-blue-50"); }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-[var(--ui-secondary)]", "bg-blue-50");
          const file = e.dataTransfer.files?.[0];
          if (file && inputRef.current) {
            // Note: Cannot programmatically set FileList on native input without DataTransfer API
            const dt = new DataTransfer();
            dt.items.add(file);
            inputRef.current.files = dt.files;
            
            // Trigger validation/change
            const event = new Event('change', { bubbles: true });
            inputRef.current.dispatchEvent(event);
            
            if (file.size <= 5 * 1024 * 1024) {
              setFileName(file.name);
            }
          }
        }}
      >
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          {fileName ? (
            <>
              <div className="rounded-full bg-emerald-100 p-2">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-emerald-800 line-clamp-1">{fileName}</p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-white p-2 shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-[var(--ui-secondary)]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--ui-primary)] group-hover:text-[var(--ui-secondary)]">Click to upload or drag & drop</p>
                <p className="mt-1 text-xs text-[var(--ui-muted)]">Max file size: 5MB (PDF/Image)</p>
              </div>
            </>
          )}
        </div>
      </div>
      <input 
        type="file" 
        id={id} 
        name={id} 
        accept={accept} 
        required={required} 
        className="hidden" 
        ref={inputRef}
        onChange={handleFile}
      />
    </Field>
  );
}
