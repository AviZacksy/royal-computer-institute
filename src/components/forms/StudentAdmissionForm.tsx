"use client";

import Link from "next/link";
import { useActionState, useRef, useState, useEffect } from "react";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { 
  Check, 
  UploadCloud, 
  Save, 
  GraduationCap, 
  User, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Lock, 
  FileCheck2,
  PhoneCall
} from "lucide-react";

type CourseOption = { id: string; name: string };
type RegisterState = {
  error?: string;
  success?: string;
  admissionNumber?: string;
} | null;

export function StudentAdmissionForm({ courses }: { courses: CourseOption[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [summary, setSummary] = useState<Record<string, any>>({});
  const [sameAddr, setSameAddr] = useState(false);
  const [permAddress, setPermAddress] = useState({
    village: "",
    post: "",
    ps: "",
    district: "",
    state: "",
    pinCode: "",
  });
  const [currAddress, setCurrAddress] = useState({
    village: "",
    post: "",
    ps: "",
    district: "",
    state: "",
    pinCode: "",
  });

  const updatePermField = (field: keyof typeof permAddress, val: string) => {
    setPermAddress(prev => {
      const next = { ...prev, [field]: val };
      if (sameAddr) {
        setCurrAddress(next);
      }
      return next;
    });
  };

  const updateCurrField = (field: keyof typeof currAddress, val: string) => {
    if (!sameAddr) {
      setCurrAddress(prev => ({ ...prev, [field]: val }));
    }
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAddr(checked);
    if (checked) {
      setCurrAddress(permAddress);
    }
  };

  const [declarationChecked, setDeclarationChecked] = useState(false);

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
        
        // Populate form inputs
        Object.keys(parsed).forEach(key => {
          const el = formRef.current?.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
          if (el && el.type !== "file") {
            el.value = parsed[key];
          }
        });

        // Restore address state
        const pAddress = {
          village: parsed.permVillage || "",
          post: parsed.permPost || "",
          ps: parsed.permPS || "",
          district: parsed.permDistrict || "",
          state: parsed.permState || "",
          pinCode: parsed.permPinCode || "",
        };
        setPermAddress(pAddress);

        if (parsed.sameAddressCheck === "on" || parsed.sameAddressCheck === true) {
          setSameAddr(true);
          setCurrAddress(pAddress);
        } else {
          setCurrAddress({
            village: parsed.currVillage || "",
            post: parsed.currPost || "",
            ps: parsed.currPS || "",
            district: parsed.currDistrict || "",
            state: parsed.currState || "",
            pinCode: parsed.currPinCode || "",
          });
        }
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

  const selectedCourse = courses.find((c) => c.id === summary.courseId)?.name || "";

  // Helper check to check if all inputs of a section are filled
  const isSectionFilled = (fields: string[]) => {
    return fields.every(field => {
      if (field === "currentAddress" && sameAddr) return true;
      if (field === "confirmPassword") {
        return summary.password && summary.password === summary.confirmPassword;
      }
      return !!summary[field];
    });
  };

  // Section completion status
  const personalFilled = isSectionFilled(["name", "phone", "parentsMobile", "email", "gender", "dateOfBirth", "aadhaarNumber", "fatherName", "motherName"]);
  const programFilled = isSectionFilled(["courseId", "password", "confirmPassword"]);
  const qualificationFilled = isSectionFilled(["qualification", "qualificationSchool", "qualificationBoard", "qualificationMarks", "qualificationYear"]);
  const addressFilled = Object.values(permAddress).every(Boolean) && (sameAddr || Object.values(currAddress).every(Boolean));
  
  // Custom validation handler on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Validations
    if (!formRef.current) return;
    const isValid = formRef.current.checkValidity();
    if (!isValid) {
      formRef.current.reportValidity();
      e.preventDefault();
      return;
    }

    const pwd = (formRef.current.elements.namedItem("password") as HTMLInputElement)?.value;
    const confirm = (formRef.current.elements.namedItem("confirmPassword") as HTMLInputElement)?.value;
    if (pwd !== confirm) {
      alert("Passwords do not match!");
      e.preventDefault();
      return;
    }

    if (!declarationChecked) {
      alert("Please check and accept the Undertaking Declaration before submitting.");
      e.preventDefault();
      return;
    }
  };

  if (state?.success) {
    // Clear draft on success
    localStorage.removeItem("admission_draft");
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-2xl animate-fade-in">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-100 mb-6">
          <Check className="h-12 w-12 text-emerald-600" />
        </div>
        <h2 className="font-display text-3xl font-extrabold text-[var(--ui-primary)] mb-4">{state.success}</h2>
        <div className="rounded-2xl bg-emerald-50/50 p-6 border border-emerald-100 mb-8 max-w-md mx-auto">
          <p className="text-xs text-emerald-700 uppercase tracking-widest font-black mb-1">Generated Admission Number</p>
          <p className="font-display text-4xl font-black text-emerald-700 tracking-tight">{state.admissionNumber}</p>
        </div>
        <p className="text-lg text-[var(--ui-muted)] mb-8 leading-relaxed">
          Your admission request has been successfully submitted. Admin approval is required before you can access the student portal. Your printable admission form has been saved.
        </p>
        <Link
          href="/student-login"
          className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-10 text-base font-bold text-white transition shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-blue-500/35"
        >
          Go to Student Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <Card className="border-[var(--ui-border)] shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
          <CardContent className="p-6 sm:p-10">
              <form ref={formRef} action={action} onSubmit={handleSubmit} onInput={handleInput} noValidate className="space-y-12">
                
                {/* Section 1: Personal Details */}
                <div id="section-personal" className="space-y-6 scroll-mt-24">
                  <div className="border-l-4 border-blue-600 pl-4 py-1">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-[var(--ui-primary)] flex items-center gap-2">
                      <User className="h-6 w-6 text-blue-600" />
                      1. Candidate Personal Profile
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Provide candidate identity information exactly as documented.</p>
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <Field label="Full Name" htmlFor="name" required>
                      <Input id="name" name="name" required autoComplete="name" placeholder="E.g. Rahul Kumar" className="h-12" />
                    </Field>
                    <Field label="Mobile Number" htmlFor="phone" required>
                      <Input id="phone" name="phone" inputMode="numeric" required autoComplete="tel" placeholder="10-digit mobile number" minLength={10} maxLength={10} className="h-12" />
                    </Field>
                    <Field label="Parents Mobile Number" htmlFor="parentsMobile" required>
                      <Input id="parentsMobile" name="parentsMobile" inputMode="numeric" required placeholder="10-digit mobile number" minLength={10} maxLength={10} className="h-12" />
                    </Field>
                    <Field label="Email ID" htmlFor="email" required>
                      <Input id="email" name="email" type="email" required autoComplete="email" placeholder="student@example.com" className="h-12" />
                    </Field>
                    <Field label="Gender" htmlFor="gender" required>
                      <Select id="gender" name="gender" required defaultValue="" className="h-12">
                        <option value="" disabled>Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </Select>
                    </Field>
                    <Field label="Date of Birth" htmlFor="dateOfBirth" required>
                      <Input id="dateOfBirth" name="dateOfBirth" type="date" required className="h-12" />
                    </Field>
                    <Field label="Aadhaar Number" htmlFor="aadhaarNumber" hint="12-digit format" required>
                      <Input id="aadhaarNumber" name="aadhaarNumber" inputMode="numeric" maxLength={12} minLength={12} required placeholder="000000000000" className="h-12" />
                    </Field>
                    <Field label="Father's Name" htmlFor="fatherName" required>
                      <Input id="fatherName" name="fatherName" required placeholder="Full Name" className="h-12" />
                    </Field>
                    <Field label="Mother's Name" htmlFor="motherName" required>
                      <Input id="motherName" name="motherName" required placeholder="Full Name" className="h-12" />
                    </Field>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section 2: Program & Login Setup */}
                <div id="section-program" className="space-y-6 scroll-mt-24">
                  <div className="border-l-4 border-blue-600 pl-4 py-1">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-[var(--ui-primary)] flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                      2. Course Selection & Portal Security
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Select a course study and define passwords to log into your portal after approval.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-3">
                    <Field label="Program / Course Interested In" htmlFor="courseId" required>
                      <Select id="courseId" name="courseId" required defaultValue="" className="h-12">
                        <option value="" disabled>Select a course program</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Portal Login Password" htmlFor="password" required>
                      <Input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" placeholder="Min. 6 characters" className="h-12" />
                    </Field>
                    <div className="space-y-1">
                      <Field label="Confirm Portal Password" htmlFor="confirmPassword" required>
                        <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" placeholder="Re-type password" className="h-12" />
                      </Field>
                      {summary.password && summary.confirmPassword && summary.password !== summary.confirmPassword && (
                        <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5 mt-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Passwords do not match!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section 3: Qualification */}
                <div id="section-qualification" className="space-y-6 scroll-mt-24">
                  <div className="border-l-4 border-blue-600 pl-4 py-1">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-[var(--ui-primary)] flex items-center gap-2">
                      <FileText className="h-6 w-6 text-blue-600" />
                      3. Academic Qualification
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Specify your highest passed educational criteria.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    <Field label="Highest Qualification" htmlFor="qualification" required>
                      <Select id="qualification" name="qualification" required defaultValue="" onChange={handleInput} className="h-12">
                        <option value="" disabled>Select your highest qualification</option>
                        <option value="10TH">10th Passed</option>
                        <option value="12TH">12th Passed</option>
                        <option value="GRADUATION">Graduation</option>
                        <option value="POST_GRADUATION">Post Graduation</option>
                      </Select>
                    </Field>

                    <Field label="School / College Name" htmlFor="qualificationSchool" required>
                      <Input id="qualificationSchool" name="qualificationSchool" required placeholder="Enter School/College Name" onChange={handleInput} className="h-12" />
                    </Field>

                    <Field label="Board / University" htmlFor="qualificationBoard" required>
                      <Input id="qualificationBoard" name="qualificationBoard" required placeholder="E.g. BSEB Patna, CBSE" onChange={handleInput} className="h-12" />
                    </Field>

                    <Field label="Marks Obtained (%)" htmlFor="qualificationMarks" required>
                      <Input id="qualificationMarks" name="qualificationMarks" type="text" required placeholder="E.g. 78.5%" onChange={handleInput} className="h-12" />
                    </Field>

                    <Field label="Passing Year" htmlFor="qualificationYear" required>
                      <Input id="qualificationYear" name="qualificationYear" inputMode="numeric" maxLength={4} minLength={4} required placeholder="E.g. 2024" onChange={handleInput} className="h-12" />
                    </Field>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section 4: Address Details */}
                <div id="section-address" className="space-y-6 scroll-mt-24">
                  <div className="border-l-4 border-blue-600 pl-4 py-1">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-[var(--ui-primary)] flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-blue-600" />
                      4. Address Details
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Provide current and permanent residential details.</p>
                  </div>

                  {/* Permanent Address */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base border-b border-slate-100 pb-2">
                      Permanent Address
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
                      <Field label="Village" htmlFor="permVillage" required>
                        <Input 
                          id="permVillage" 
                          name="permVillage" 
                          required 
                          placeholder="Village Name" 
                          value={permAddress.village}
                          onChange={(e) => { updatePermField("village", e.target.value); handleInput(); }}
                          className="h-12" 
                        />
                      </Field>
                      <Field label="Post Office (Post)" htmlFor="permPost" required>
                        <Input 
                          id="permPost" 
                          name="permPost" 
                          required 
                          placeholder="Post Office" 
                          value={permAddress.post}
                          onChange={(e) => { updatePermField("post", e.target.value); handleInput(); }}
                          className="h-12" 
                        />
                      </Field>
                      <Field label="Police Station (P.S.)" htmlFor="permPS" required>
                        <Input 
                          id="permPS" 
                          name="permPS" 
                          required 
                          placeholder="Police Station" 
                          value={permAddress.ps}
                          onChange={(e) => { updatePermField("ps", e.target.value); handleInput(); }}
                          className="h-12" 
                        />
                      </Field>
                      <Field label="District" htmlFor="permDistrict" required>
                        <Input 
                          id="permDistrict" 
                          name="permDistrict" 
                          required 
                          placeholder="District" 
                          value={permAddress.district}
                          onChange={(e) => { updatePermField("district", e.target.value); handleInput(); }}
                          className="h-12" 
                        />
                      </Field>
                      <Field label="State" htmlFor="permState" required>
                        <Input 
                          id="permState" 
                          name="permState" 
                          required 
                          placeholder="State" 
                          value={permAddress.state}
                          onChange={(e) => { updatePermField("state", e.target.value); handleInput(); }}
                          className="h-12" 
                        />
                      </Field>
                      <Field label="PIN Code" htmlFor="permPinCode" required>
                        <Input 
                          id="permPinCode" 
                          name="permPinCode" 
                          inputMode="numeric" 
                          maxLength={6} 
                          minLength={6} 
                          required 
                          placeholder="6-digit PIN" 
                          value={permAddress.pinCode}
                          onChange={(e) => { updatePermField("pinCode", e.target.value); handleInput(); }}
                          className="h-12" 
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Same as Permanent Checkbox */}
                  <div className="flex items-center gap-2.5 py-1">
                    <input 
                      type="checkbox" 
                      id="sameAddressCheck" 
                      name="sameAddressCheck"
                      checked={sameAddr} 
                      onChange={(e) => { handleSameAddressChange(e.target.checked); handleInput(); }}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="sameAddressCheck" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                      Same as Permanent Address
                    </label>
                  </div>

                  {/* Current/Local Address */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base border-b border-slate-100 pb-2">
                      Current / Local Address
                    </h4>
                    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
                      <Field label="Village" htmlFor="currVillage" required>
                        <Input 
                          id="currVillage" 
                          name="currVillage" 
                          required 
                          placeholder="Village Name" 
                          value={currAddress.village}
                          readOnly={sameAddr}
                          onChange={(e) => { updateCurrField("village", e.target.value); handleInput(); }}
                          className={`h-12 ${sameAddr ? "bg-slate-50 border-dashed border-slate-300 text-slate-500" : ""}`} 
                        />
                      </Field>
                      <Field label="Post Office (Post)" htmlFor="currPost" required>
                        <Input 
                          id="currPost" 
                          name="currPost" 
                          required 
                          placeholder="Post Office" 
                          value={currAddress.post}
                          readOnly={sameAddr}
                          onChange={(e) => { updateCurrField("post", e.target.value); handleInput(); }}
                          className={`h-12 ${sameAddr ? "bg-slate-50 border-dashed border-slate-300 text-slate-500" : ""}`} 
                        />
                      </Field>
                      <Field label="Police Station (P.S.)" htmlFor="currPS" required>
                        <Input 
                          id="currPS" 
                          name="currPS" 
                          required 
                          placeholder="Police Station" 
                          value={currAddress.ps}
                          readOnly={sameAddr}
                          onChange={(e) => { updateCurrField("ps", e.target.value); handleInput(); }}
                          className={`h-12 ${sameAddr ? "bg-slate-50 border-dashed border-slate-300 text-slate-500" : ""}`} 
                        />
                      </Field>
                      <Field label="District" htmlFor="currDistrict" required>
                        <Input 
                          id="currDistrict" 
                          name="currDistrict" 
                          required 
                          placeholder="District" 
                          value={currAddress.district}
                          readOnly={sameAddr}
                          onChange={(e) => { updateCurrField("district", e.target.value); handleInput(); }}
                          className={`h-12 ${sameAddr ? "bg-slate-50 border-dashed border-slate-300 text-slate-500" : ""}`} 
                        />
                      </Field>
                      <Field label="State" htmlFor="currState" required>
                        <Input 
                          id="currState" 
                          name="currState" 
                          required 
                          placeholder="State" 
                          value={currAddress.state}
                          readOnly={sameAddr}
                          onChange={(e) => { updateCurrField("state", e.target.value); handleInput(); }}
                          className={`h-12 ${sameAddr ? "bg-slate-50 border-dashed border-slate-300 text-slate-500" : ""}`} 
                        />
                      </Field>
                      <Field label="PIN Code" htmlFor="currPinCode" required>
                        <Input 
                          id="currPinCode" 
                          name="currPinCode" 
                          inputMode="numeric" 
                          maxLength={6} 
                          minLength={6} 
                          required 
                          placeholder="6-digit PIN" 
                          value={currAddress.pinCode}
                          readOnly={sameAddr}
                          onChange={(e) => { updateCurrField("pinCode", e.target.value); handleInput(); }}
                          className={`h-12 ${sameAddr ? "bg-slate-50 border-dashed border-slate-300 text-slate-500" : ""}`} 
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section 5: Documents */}
                <div id="section-documents" className="space-y-6 scroll-mt-24">
                  <div className="border-l-4 border-blue-600 pl-4 py-1">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-[var(--ui-primary)] flex items-center gap-2">
                      <UploadCloud className="h-6 w-6 text-blue-600" />
                      5. Upload Supporting Documents
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Upload scanned attachments (Image/PDF format, size limit: 5MB each).</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <FileDropzone id="studentPhoto" label="Student Passport Photo" required />
                    <FileDropzone id="signature" label="Student Signature" required />
                    <FileDropzone id="aadhaarCard" label="Aadhaar Card Copy" required />
                    <FileDropzone 
                      id="marksheet" 
                      label={
                        summary.qualification === "10TH" ? "10th Marksheet Copy" :
                        summary.qualification === "12TH" ? "12th Marksheet Copy" :
                        summary.qualification === "GRADUATION" ? "Graduation Marksheet Copy" :
                        summary.qualification === "POST_GRADUATION" ? "Post Graduation Marksheet Copy" :
                        "Latest Marksheet Copy"
                      } 
                      required 
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Section 6: Declaration & Submit */}
                <div id="section-declaration" className="space-y-6 scroll-mt-24">
                  <div className="border-l-4 border-amber-500 pl-4 py-1">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-[var(--ui-primary)] flex items-center gap-2">
                      <FileCheck2 className="h-6 w-6 text-amber-500" />
                      6. Candidate Undertaking & Declaration
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p>
                      I hereby declare that all statements made in this online application form are true, complete, and correct to the best of my knowledge and belief. I understand that in the event of any information being found false, incorrect, or incomplete, my admission request is liable to be rejected immediately, even after registration.
                    </p>
                    <p>
                      I agree to abide by all the rules, codes of conduct, and academic regulations laid down by Royal Computer Institute.
                    </p>
                    <div className="flex items-start gap-3 pt-2">
                      <input 
                        type="checkbox" 
                        id="declarationCheck" 
                        required
                        checked={declarationChecked}
                        onChange={(e) => setDeclarationChecked(e.target.checked)}
                        className="h-5 w-5 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                      />
                      <label htmlFor="declarationCheck" className="font-bold text-slate-800 cursor-pointer select-none">
                        I accept the above undertaking and declare the details entered are genuine. *
                      </label>
                    </div>
                  </div>

                  {state?.error ? (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p>{state.error}</p>
                    </div>
                  ) : null}

                  {/* Form Submission Action Row */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
                    <Button type="button" variant="outline" onClick={saveDraft} className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold">
                      <Save className="mr-2 h-4.5 w-4.5" /> Save Draft Locally
                    </Button>

                    <Button 
                      type="submit" 
                      disabled={pending || courses.length === 0} 
                      className="w-full sm:w-auto h-14 px-12 rounded-xl font-extrabold text-lg bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-xl shadow-blue-500/20 hover:scale-102 hover:shadow-blue-500/30 transition-all"
                    >
                      {pending ? "Submitting Request..." : "Submit Registration"}
                    </Button>
                  </div>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}

// Custom Drag and Drop File Input with Preview
function FileDropzone({ id, label, required, accept = "image/*,application/pdf" }: { id: string, label: string, required?: boolean, accept?: string }) {
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        e.target.value = "";
        setFileName("");
        setPreviewUrl("");
      } else {
        setFileName(file.name);
        if (file.type.startsWith("image/")) {
          setPreviewUrl(URL.createObjectURL(file));
        } else {
          setPreviewUrl(""); // Clear if it's PDF
        }
      }
    } else {
      setFileName("");
      setPreviewUrl("");
    }
  };

  // Clean up Object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <Field label={required ? `${label} *` : label} htmlFor={id}>
      <div 
        className={`group flex h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${fileName ? "border-emerald-400 bg-emerald-50/50" : "border-slate-300 bg-slate-50 hover:border-blue-600 hover:bg-blue-50/30"}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-blue-600", "bg-blue-50/30"); }}
        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-blue-600", "bg-blue-50/30"); }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-blue-600", "bg-blue-50/30");
          const file = e.dataTransfer.files?.[0];
          if (file && inputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            inputRef.current.files = dt.files;
            
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            inputRef.current.dispatchEvent(event);
            
            if (file.size <= 5 * 1024 * 1024) {
              setFileName(file.name);
              if (file.type.startsWith("image/")) {
                setPreviewUrl(URL.createObjectURL(file));
              } else {
                setPreviewUrl("");
              }
            }
          }
        }}
      >
        <div className="flex items-center gap-4 px-4 text-left w-full h-full justify-center">
          {fileName ? (
            <div className="flex items-center gap-3 w-full">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Upload preview" className="h-20 w-20 rounded-xl object-cover border-2 border-white shadow-md shrink-0 bg-white" />
              ) : (
                <div className="rounded-xl bg-emerald-100 p-3 shrink-0">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-emerald-900 truncate">{fileName}</p>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">Uploaded successfully</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-white p-2.5 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700">Click or drag & drop to upload</p>
                <p className="mt-0.5 text-xs text-slate-400 font-medium">JPEG, PNG, or PDF up to 5MB</p>
              </div>
            </div>
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
