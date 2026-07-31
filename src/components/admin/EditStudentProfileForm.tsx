"use client";

import { useActionState, useEffect, useState } from "react";
import { updateStudentProfileAction } from "@/actions/admin/students";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { X, Edit2 } from "lucide-react";

interface EditStudentProfileFormProps {
  student: {
    id: string;
    name: string;
    fatherName: string | null;
    motherName: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
    phone: string;
    qualification: string | null;
    currentAddress: string | null;
    permanentAddress: string | null;
    address: string | null;
    admissionDetails: any;
    user: {
      email: string;
    };
  };
}

export function EditStudentProfileForm({ student }: EditStudentProfileFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, pending] = useActionState(updateStudentProfileAction, null as ActionState);

  // Extract nested details
  const details = (student.admissionDetails as Record<string, any>) || {};
  const initialAadhaarNumber = details.aadhaarNumber || "";
  const initialParentsMobile = details.parentsMobile || "";
  const initialQualificationSchool = details.qualificationSchool || "";
  const initialQualificationBoard = details.qualificationBoard || "";
  const initialQualificationMarks = details.qualificationMarks || "";
  const initialQualificationYear = details.qualificationYear || "";

  const formattedDob = student.dateOfBirth
    ? new Date(student.dateOfBirth).toISOString().split("T")[0]
    : "";

  // Close modal on successful update
  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state?.success]);

  return (
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-xs h-9 px-3 font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <Edit2 className="h-3 w-3" />
        Edit Profile
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative my-8 w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Student Profile</h3>
                <p className="text-xs text-gray-500 mt-0.5">Modify student personal, qualification, and address details.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <form action={action} className="flex-1 overflow-y-auto p-6 space-y-6">
              <input type="hidden" name="studentId" value={student.id} />

              {/* Section: Personal Info */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Personal Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name" htmlFor="name">
                    <Input id="name" name="name" defaultValue={student.name} required />
                  </Field>
                  <Field label="Father's Name" htmlFor="fatherName">
                    <Input id="fatherName" name="fatherName" defaultValue={student.fatherName || ""} required />
                  </Field>
                  <Field label="Mother's Name" htmlFor="motherName">
                    <Input id="motherName" name="motherName" defaultValue={student.motherName || ""} required />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Gender" htmlFor="gender">
                      <Select id="gender" name="gender" defaultValue={student.gender || "MALE"} required>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </Select>
                    </Field>
                    <Field label="Date of Birth" htmlFor="dateOfBirth">
                      <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={formattedDob} required />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Section: Contact Details */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Student Phone Number" htmlFor="phone">
                    <Input id="phone" name="phone" defaultValue={student.phone} required placeholder="10-digit phone number" maxLength={15} />
                  </Field>
                  <Field label="Parents Mobile Number" htmlFor="parentsMobile">
                    <Input id="parentsMobile" name="parentsMobile" defaultValue={initialParentsMobile} required placeholder="10-digit mobile number" maxLength={15} />
                  </Field>
                  <Field label="Email Address" htmlFor="email">
                    <Input id="email" name="email" type="email" defaultValue={student.user.email} required />
                  </Field>
                </div>
              </div>

              {/* Section: Qualifications */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Qualification & Aadhaar Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Highest Qualification" htmlFor="qualification">
                    <Select id="qualification" name="qualification" defaultValue={student.qualification || "12TH"} required>
                      <option value="10TH">10th Class</option>
                      <option value="12TH">12th Class</option>
                      <option value="GRADUATION">Graduation</option>
                      <option value="POST_GRADUATION">Post Graduation</option>
                    </Select>
                  </Field>
                  <Field label="School/College Name" htmlFor="qualificationSchool">
                    <Input id="qualificationSchool" name="qualificationSchool" defaultValue={initialQualificationSchool} required />
                  </Field>
                  <Field label="Board Name" htmlFor="qualificationBoard">
                    <Input id="qualificationBoard" name="qualificationBoard" defaultValue={initialQualificationBoard} required />
                  </Field>
                  <Field label="Marks Percentage" htmlFor="qualificationMarks">
                    <Input id="qualificationMarks" name="qualificationMarks" defaultValue={initialQualificationMarks} required placeholder="e.g. 78.5%" />
                  </Field>
                  <Field label="Passing Year" htmlFor="qualificationYear">
                    <Input id="qualificationYear" name="qualificationYear" defaultValue={initialQualificationYear} required placeholder="e.g. 2022" maxLength={4} />
                  </Field>
                  <Field label="Aadhaar Card Number" htmlFor="aadhaarNumber">
                    <Input id="aadhaarNumber" name="aadhaarNumber" defaultValue={initialAadhaarNumber} required placeholder="12 digit Aadhaar number" maxLength={12} minLength={12} />
                  </Field>
                </div>
              </div>

              {/* Section: Address Details */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Addresses</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Current Address" htmlFor="currentAddress">
                    <Textarea id="currentAddress" name="currentAddress" defaultValue={student.currentAddress || student.address || ""} required />
                  </Field>
                  <Field label="Permanent Address" htmlFor="permanentAddress">
                    <Textarea id="permanentAddress" name="permanentAddress" defaultValue={student.permanentAddress || ""} required />
                  </Field>
                </div>
              </div>

              {/* Action Feedback messages */}
              {state?.error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 font-medium">
                  {state.error}
                </div>
              )}
              {state?.success && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 font-medium">
                  {state.success}
                </div>
              )}

              {/* Action Buttons inside scrollable form to keep layout intact */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={pending}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={pending}>
                  {pending ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
