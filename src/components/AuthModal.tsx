"use client";

import React, { useState } from "react";
import { Trees, XCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { UserProfile } from "@/types";
import { ADMIN_EMAIL, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "signup" | "pending";
  onLoginSuccess: (user: UserProfile) => void;
  registeredUsers: UserProfile[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  addMailLog: (log: { to: string; subject: string; body: string; timestamp: string }) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode,
  onLoginSuccess,
  registeredUsers,
  setRegisteredUsers,
  addMailLog
}: AuthModalProps) {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "pending">(initialMode);
  
  // Sign up form states
  const [signupForm, setSignupForm] = useState({
    name: "",
    age: "",
    gender: "Male" as "Male" | "Female" | "Other",
    gotra: "Moudgalya",
    email: "",
    phone: "",
    relation: ""
  });
  
  // Inline field validation error objects
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [modalNotification, setModalNotification] = useState<{ type: "error" | "success" | "warning" | "info"; msg: string } | null>(null);

  if (!isOpen) return null;

  // Strict field validation handler
  const validateSignupForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 1. Name Validation (Textbox)
    if (!signupForm.name.trim()) {
      errors.name = "Full Name is required.";
    } else if (signupForm.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters long.";
    }

    // 2. Age Validation (Textbox/Number)
    if (!signupForm.age) {
      errors.age = "Age is required.";
    } else {
      const ageNum = Number(signupForm.age);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
        errors.age = "Enter a valid age (1 - 120).";
      }
    }

    // 3. Gender Validation (Radio Button)
    if (!signupForm.gender) {
      errors.gender = "Gender selection is required.";
    }

    // 4. Gotra Validation (Textbox)
    if (!signupForm.gotra.trim()) {
      errors.gotra = "Gotra is required.";
    }

    // 5. Mail ID Validation (Textbox)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupForm.email.trim()) {
      errors.email = "Mail ID is required.";
    } else if (!emailRegex.test(signupForm.email.trim())) {
      errors.email = "Enter a valid email address (e.g. user@gmail.com).";
    }

    // 6. Phone Number Validation (Textbox)
    const cleanPhone = signupForm.phone.replace(/[\s\-\+\(\)]/g, "");
    if (!signupForm.phone.trim()) {
      errors.phone = "Phone Number is required.";
    } else if (cleanPhone.length < 10 || isNaN(Number(cleanPhone))) {
      errors.phone = "Enter a valid 10-digit phone number.";
    }

    // 7. How Related to Bandhakavi Hierarchy Validation (Textbox)
    if (!signupForm.relation.trim()) {
      errors.relation = "Please specify how you are related to Bandhakavi hierarchy.";
    } else if (signupForm.relation.trim().length < 5) {
      errors.relation = "Please provide a more descriptive relation (min 5 characters).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalNotification(null);

    if (!validateSignupForm()) return;

    const userEmail = signupForm.email.trim().toLowerCase();
    const isMasterAdmin = userEmail === ADMIN_EMAIL.toLowerCase();

    const newUserRecord: UserProfile = {
      name: signupForm.name.trim(),
      age: signupForm.age,
      gender: signupForm.gender,
      gotra: signupForm.gotra.trim(),
      email: userEmail,
      phone: signupForm.phone.trim(),
      relation: signupForm.relation.trim(),
      status: isMasterAdmin ? "approved" : "pending",
      isAdmin: isMasterAdmin,
      createdAt: new Date().toISOString()
    };

    try {
      // Save to Firestore users collection
      const docId = userEmail.replace(/[@.]/g, "_");
      await setDoc(doc(db, "users", docId), newUserRecord);
    } catch (err) {
      console.log("Firestore write info:", err);
    }

    // Update local state
    setRegisteredUsers((prev) => [...prev.filter((u) => u.email !== userEmail), newUserRecord]);

    // Dispatch simulated and API notifications to User and Admin
    const userMailLog = {
      to: userEmail,
      subject: "Bandhakavi Family Portal - Registration Submitted",
      body: `Dear ${signupForm.name},\n\nThank you for registering with the Bandhakavi Family Portal.\nYour registration details have been submitted to the Admin (${ADMIN_EMAIL}) for verification.\n\nStatus: Pending Admin Approval\n\nYou will be notified once approved.`,
      timestamp: new Date().toISOString()
    };

    const adminMailLog = {
      to: ADMIN_EMAIL,
      subject: "ACTION REQUIRED: New Bandhakavi Member Registration Request",
      body: `New Registration Details:\nName: ${signupForm.name}\nAge: ${signupForm.age}\nGender: ${signupForm.gender}\nGotra: ${signupForm.gotra}\nEmail: ${userEmail}\nPhone: ${signupForm.phone}\nRelation to Bandhakavi Hierarchy: ${signupForm.relation}\n\nPlease review and approve/reject this user in the Admin Approvals panel.`,
      timestamp: new Date().toISOString()
    };

    addMailLog(userMailLog);
    addMailLog(adminMailLog);

    // Call internal email API route
    try {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userEmail,
          subject: userMailLog.subject,
          body: userMailLog.body,
          type: "USER_REGISTRATION"
        })
      });
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: ADMIN_EMAIL,
          subject: adminMailLog.subject,
          body: adminMailLog.body,
          type: "ADMIN_NOTIFICATION"
        })
      });
    } catch (err) {
      console.log("API email trigger:", err);
    }

    if (isMasterAdmin) {
      onLoginSuccess(newUserRecord);
      onClose();
    } else {
      setAuthMode("pending");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalNotification(null);

    const testEmail = loginEmail.trim().toLowerCase();

    if (!testEmail) {
      setModalNotification({ type: "error", msg: "Please enter your email address to log in." });
      return;
    }

    // Direct Admin override for dattu99amm@gmail.com
    if (testEmail === ADMIN_EMAIL.toLowerCase()) {
      const adminUser: UserProfile = {
        name: "Bandhakavi Dattatreya Sastri",
        email: ADMIN_EMAIL,
        age: 38,
        gender: "Male",
        gotra: "Moudgalya",
        phone: "+91 98765 00004",
        relation: "Lead Admin & Patriarch Grandson",
        status: "approved",
        isAdmin: true,
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    const matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === testEmail);

    if (!matchedUser) {
      setModalNotification({
        type: "error",
        msg: "No registered account found with this email. Please Sign Up to request access."
      });
      return;
    }

    if (matchedUser.status === "pending") {
      setModalNotification({
        type: "warning",
        msg: `Account Pending Approval! Verification emails have been sent to ${testEmail} and Admin (${ADMIN_EMAIL}). You cannot log in until approved.`
      });
      setAuthMode("pending");
      return;
    }

    if (matchedUser.status === "rejected") {
      setModalNotification({
        type: "error",
        msg: "Your registration request was not approved by the Bandhakavi family administrator."
      });
      return;
    }

    // Approved User -> Login Success
    onLoginSuccess(matchedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-amber-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <XCircle className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Trees className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {authMode === "login"
              ? "Bandhakavi Family Login"
              : authMode === "signup"
              ? "Register Relation Details"
              : "Registration Submitted"}
          </h3>
          <p className="text-xs text-slate-500">
            {authMode === "login"
              ? "Enter your approved email ID to access the tree and portal"
              : authMode === "signup"
              ? "All fields are mandatory. Details will be sent to Admin for approval."
              : "Awaiting approval from Admin (dattu99amm@gmail.com)"}
          </p>
        </div>

        {/* Modal Notification */}
        {modalNotification && (
          <div className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
            modalNotification.type === "error" ? "bg-rose-100 text-rose-800 border border-rose-200" :
            modalNotification.type === "warning" ? "bg-amber-100 text-amber-900 border border-amber-200" :
            "bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}>
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{modalNotification.msg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mail ID *
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder="e.g. dattu99amm@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-sm shadow-md transition"
            >
              Log In
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setModalNotification(null);
                  setAuthMode("signup");
                }}
                className="text-xs text-amber-800 font-bold hover:underline"
              >
                Don't have an approved account? Sign Up
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP FORM WITH ALL 7 MANDATORY VALIDATED FIELDS */}
        {authMode === "signup" && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            
            {/* Field 1: Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name (Textbox) *
              </label>
              <input
                type="text"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                placeholder="e.g. Bandhakavi Dattatreya"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                  formErrors.name ? "border-rose-500 bg-rose-50" : "border-slate-300 focus:ring-2 focus:ring-amber-500"
                }`}
              />
              {formErrors.name && <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.name}</p>}
            </div>

            {/* Field 2 & 3: Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  value={signupForm.age}
                  onChange={(e) => setSignupForm({ ...signupForm, age: e.target.value })}
                  placeholder="e.g. 35"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    formErrors.age ? "border-rose-500 bg-rose-50" : "border-slate-300 focus:ring-2 focus:ring-amber-500"
                  }`}
                />
                {formErrors.age && <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.age}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gender (Radio Button) *
                </label>
                <div className="flex items-center space-x-3 pt-2">
                  {(["Male", "Female", "Other"] as const).map((g) => (
                    <label key={g} className="inline-flex items-center text-xs font-medium text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={signupForm.gender === g}
                        onChange={(e) => setSignupForm({ ...signupForm, gender: e.target.value as any })}
                        className="text-amber-600 focus:ring-amber-500 mr-1"
                      />
                      {g}
                    </label>
                  ))}
                </div>
                {formErrors.gender && <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.gender}</p>}
              </div>
            </div>

            {/* Field 4: Gotra */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gotra (Textbox) *
              </label>
              <input
                type="text"
                value={signupForm.gotra}
                onChange={(e) => setSignupForm({ ...signupForm, gotra: e.target.value })}
                placeholder="e.g. Moudgalya"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                  formErrors.gotra ? "border-rose-500 bg-rose-50" : "border-slate-300 focus:ring-2 focus:ring-amber-500"
                }`}
              />
              {formErrors.gotra && <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.gotra}</p>}
            </div>

            {/* Field 5 & 6: Mail ID & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mail ID *
                </label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="user@gmail.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    formErrors.email ? "border-rose-500 bg-rose-50" : "border-slate-300 focus:ring-2 focus:ring-amber-500"
                  }`}
                />
                {formErrors.email && <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  placeholder="10-digit phone"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                    formErrors.phone ? "border-rose-500 bg-rose-50" : "border-slate-300 focus:ring-2 focus:ring-amber-500"
                  }`}
                />
                {formErrors.phone && <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.phone}</p>}
              </div>
            </div>

            {/* Field 7: How Related to Bandhakavi Hierarchy */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                How Related to Bandhakavi Hierarchy? (Textbox) *
              </label>
              <textarea
                rows={3}
                value={signupForm.relation}
                onChange={(e) => setSignupForm({ ...signupForm, relation: e.target.value })}
                placeholder="e.g. Grandson of Bandhakavi Ramakrishna Sharma..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                  formErrors.relation ? "border-rose-500 bg-rose-50" : "border-slate-300 focus:ring-2 focus:ring-amber-500"
                }`}
              />
              {formErrors.relation && <p className="text-[11px] text-rose-600 font-semibold mt-1">{formErrors.relation}</p>}
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <p className="font-semibold">Email Approval Dispatch:</p>
              Upon submission, notification emails will be sent to your Mail ID and to Admin (<strong>{ADMIN_EMAIL}</strong>).
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-2xl text-sm shadow-md transition"
            >
              Submit Registration Request
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setModalNotification(null);
                  setAuthMode("login");
                }}
                className="text-xs text-amber-800 font-bold hover:underline"
              >
                Already registered? Log In
              </button>
            </div>
          </form>
        )}

        {/* PENDING NOTIFICATION SCREEN */}
        {authMode === "pending" && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Awaiting Admin Approval</h4>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto">
              An email notification has been dispatched to your Mail ID and to the Master Admin (<strong>{ADMIN_EMAIL}</strong>). You will be able to log in once the admin approves your request.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
