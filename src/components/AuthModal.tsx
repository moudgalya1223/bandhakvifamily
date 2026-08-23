"use client";

import React, { useState } from "react";
import { Trees, XCircle, AlertCircle } from "lucide-react";
import { UserProfile } from "@/types";
import { ADMIN_EMAIL, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "signup" | "pending" | "admin";
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
  const [authMode, setAuthMode] = useState<"login" | "signup" | "pending" | "admin">(initialMode);
  
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
  const [loginEmail, setLoginEmail] = useState(initialMode === "admin" ? ADMIN_EMAIL : "");
  const [modalNotification, setModalNotification] = useState<{ type: "error" | "success" | "warning" | "info"; msg: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setAuthMode(initialMode);
    if (initialMode === "admin") {
      setLoginEmail(ADMIN_EMAIL);
    }
  }, [initialMode, isOpen]);

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
    setIsSubmitting(true);

    if (!validateSignupForm()) {
      setModalNotification({
        type: "error",
        msg: "Form submission failed. Please correct the highlighted errors below."
      });
      setIsSubmitting(false);
      return;
    }

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
      const docId = userEmail.replace(/[@.]/g, "_");
      await setDoc(doc(db, "users", docId), newUserRecord);
    } catch (err: any) {
      console.log("Firestore write info:", err);
      setModalNotification({
        type: "error",
        msg: `Failed to save registration: ${err?.message || "Database connection issue."}`
      });
    }

    setRegisteredUsers((prev) => [...prev.filter((u) => u.email !== userEmail), newUserRecord]);

    const userMailLog = {
      to: userEmail,
      subject: "Bandhakavi Family Portal - Registration Submitted",
      body: `Dear ${signupForm.name},\n\nThank you for registering with the Bandhakavi Family Portal.\nYour registration details have been submitted to the Admin for verification.\n\nStatus: Pending Admin Approval\n\nYou will be notified once approved.`,
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

    // Send real confirmation emails to applicant & admin via SMTP API
    try {
      await Promise.all([
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: userEmail,
            subject: userMailLog.subject,
            body: userMailLog.body,
            type: "USER_REGISTRATION"
          })
        }),
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: ADMIN_EMAIL,
            subject: adminMailLog.subject,
            body: adminMailLog.body,
            type: "ADMIN_NOTIFICATION"
          })
        })
      ]);
    } catch (err: any) {
      console.log("API email trigger:", err);
      setModalNotification({
        type: "warning",
        msg: "Registration saved, but email notification service experienced a delay."
      });
    } finally {
      setIsSubmitting(false);
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

    const matchedUser = registeredUsers.find(
      (u) => u?.email && typeof u.email === "string" && u.email.toLowerCase() === testEmail
    );

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
        msg: `Account Pending Approval! Verification emails have been sent to ${testEmail} and the Master Admin. You cannot log in until approved.`
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

    onLoginSuccess(matchedUser);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-lg w-full border border-amber-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
      >
        
        {/* Sticky Fixed Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-4 top-4 z-30 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm"
          title="Close window"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md mx-auto mb-2 bg-amber-900 flex-shrink-0">
              <img
                src="/rishi_logo.jpg"
                alt="Moudgalya Rishi Logo"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {authMode === "admin"
                ? "Master Admin Login"
                : authMode === "login"
                ? "Bandhakavi Family Login"
                : authMode === "signup"
                ? "Register Relation Details"
                : "Registration Submitted"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {authMode === "admin"
                ? "Sign in with Master Admin credentials to access in-app approvals"
                : authMode === "login"
                ? "Enter your approved email ID to access the tree and portal"
                : authMode === "signup"
                ? "All fields are mandatory. Details will be sent to Admin for approval."
                : "Awaiting approval from Master Admin"}
            </p>
          </div>

          {/* Modal Notification */}
          {modalNotification && (
            <div className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
              modalNotification.type === "error" ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800" :
              modalNotification.type === "warning" ? "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800" :
              "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            }`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{modalNotification.msg}</span>
            </div>
          )}

          {/* LOGIN FORM (Standard or Admin Mode) */}
          {(authMode === "login" || authMode === "admin") && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Mail ID *
                  </label>
                  {authMode !== "admin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("admin");
                        setLoginEmail(ADMIN_EMAIL);
                      }}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Switch to Admin Login
                    </button>
                  )}
                </div>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  placeholder="e.g. user@gmail.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none transition ${
                    authMode === "admin"
                      ? "border-purple-400 focus:ring-2 focus:ring-purple-500"
                      : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  }`}
                />
              </div>

              {authMode === "admin" && (
                <div className="bg-purple-50 dark:bg-purple-950/60 p-3 rounded-xl border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-200 leading-relaxed">
                  <span className="font-bold">Master Admin Sign-In:</span> Enter your admin email credentials to sign in and open the Admin Approvals Dashboard.
                </div>
              )}

            <button
              type="submit"
              className={`w-full py-3 text-white font-bold rounded-2xl text-sm shadow-md transition ${
                authMode === "admin"
                  ? "bg-purple-700 hover:bg-purple-800 shadow-purple-700/20"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
              }`}
            >
              {authMode === "admin" ? "Sign In as Master Admin" : "Log In"}
            </button>

            <div className="flex justify-between items-center pt-2 text-xs font-bold">
              {authMode === "admin" ? (
                <button
                  type="button"
                  onClick={() => {
                    setModalNotification(null);
                    setAuthMode("login");
                    setLoginEmail("");
                  }}
                  className="text-slate-600 dark:text-slate-400 hover:underline"
                >
                  Standard Member Login
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setModalNotification(null);
                    setAuthMode("signup");
                  }}
                  className="text-amber-800 dark:text-amber-400 hover:underline"
                >
                  Don't have an approved account? Sign Up
                </button>
              )}

              {authMode !== "admin" && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("admin");
                    setLoginEmail(ADMIN_EMAIL);
                  }}
                  className="text-purple-700 dark:text-purple-400 hover:underline"
                >
                  Admin Approvals
                </button>
              )}
            </div>
          </form>
        )}

        {/* SIGN UP FORM WITH ALL 7 MANDATORY VALIDATED FIELDS */}
        {authMode === "signup" && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            
            {/* Field 1: Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Full Name (Textbox) *
              </label>
              <input
                type="text"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                placeholder="e.g. Bandhakavi Dattatreya"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  formErrors.name ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40" : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                }`}
              />
              {formErrors.name && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{formErrors.name}</p>}
            </div>

            {/* Field 2 & 3: Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  value={signupForm.age}
                  onChange={(e) => setSignupForm({ ...signupForm, age: e.target.value })}
                  placeholder="e.g. 35"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                    formErrors.age ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40" : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  }`}
                />
                {formErrors.age && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{formErrors.age}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Gender (Radio Button) *
                </label>
                <div className="flex items-center space-x-3 pt-2">
                  {(["Male", "Female", "Other"] as const).map((g) => (
                    <label key={g} className="inline-flex items-center text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
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
                {formErrors.gender && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{formErrors.gender}</p>}
              </div>
            </div>

            {/* Field 4: Gotra */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Gotra (Textbox) *
              </label>
              <input
                type="text"
                value={signupForm.gotra}
                onChange={(e) => setSignupForm({ ...signupForm, gotra: e.target.value })}
                placeholder="e.g. Moudgalya"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  formErrors.gotra ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40" : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                }`}
              />
              {formErrors.gotra && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{formErrors.gotra}</p>}
            </div>

            {/* Field 5 & 6: Mail ID & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Mail ID *
                </label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="user@gmail.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                    formErrors.email ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40" : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  }`}
                />
                {formErrors.email && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  placeholder="10-digit phone"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                    formErrors.phone ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40" : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                  }`}
                />
                {formErrors.phone && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{formErrors.phone}</p>}
              </div>
            </div>

            {/* Field 7: How Related to Bandhakavi Hierarchy */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                How Related to Bandhakavi Hierarchy? (Textbox) *
              </label>
              <textarea
                rows={3}
                value={signupForm.relation}
                onChange={(e) => setSignupForm({ ...signupForm, relation: e.target.value })}
                placeholder="e.g. Grandson of Bandhakavi Ramakrishna Sharma..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                  formErrors.relation ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40" : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500"
                }`}
              />
              {formErrors.relation && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">{formErrors.relation}</p>}
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/60 p-3 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
              <p className="font-semibold">Email Approval Dispatch:</p>
              Upon submission, notification emails will be dispatched to your Mail ID and to the Family Administrator for verification.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-2xl text-sm shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting & Sending Mailers...</span>
                </>
              ) : (
                <span>Submit Registration Request</span>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setModalNotification(null);
                  setAuthMode("login");
                }}
                className="text-xs text-amber-800 dark:text-amber-400 font-bold hover:underline"
              >
                Already registered? Log In
              </button>
            </div>
          </form>
        )}

        {/* PENDING NOTIFICATION SCREEN */}
        {authMode === "pending" && (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Awaiting Admin Approval</h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
              An email notification has been dispatched to your Mail ID and to the Master Admin for verification. You will be able to log in once the admin approves your request.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}
