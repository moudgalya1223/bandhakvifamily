"use client";

import React from "react";
import { ShieldCheck, Mail, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { UserProfile, MailLog } from "@/types";
import { ADMIN_EMAIL, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface AdminPanelProps {
  registeredUsers: UserProfile[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  mailLogs: MailLog[];
  addMailLog: (log: MailLog) => void;
  onUserApproved: (user: UserProfile) => void;
}

export default function AdminPanel({
  registeredUsers,
  setRegisteredUsers,
  mailLogs,
  addMailLog,
  onUserApproved
}: AdminPanelProps) {

  const handleAdminApproval = async (targetEmail: string, newStatus: "approved" | "rejected") => {
    try {
      const docId = targetEmail.replace(/[@.]/g, "_");
      await setDoc(doc(db, "users", docId), { status: newStatus }, { merge: true });
    } catch (err) {
      console.log("Firestore update info:", err);
    }

    const updatedUser = registeredUsers.find((u) => u.email === targetEmail);

    setRegisteredUsers((prev) =>
      prev.map((u) => (u.email === targetEmail ? { ...u, status: newStatus } : u))
    );

    if (updatedUser && newStatus === "approved") {
      onUserApproved(updatedUser);
    }

    // Log & send notification email to user
    const dispatchMail = {
      to: targetEmail,
      subject: `Bandhakavi Family App - Registration ${newStatus.toUpperCase()}`,
      body: `Dear Applicant,\n\nYour registration request for the Bandhakavi Family Portal has been ${newStatus.toUpperCase()} by the Master Admin (${ADMIN_EMAIL}).\n\n${
        newStatus === "approved"
          ? "You can now log in to the portal using your registered email ID."
          : "Please contact the admin if you believe this was an error."
      }`,
      timestamp: new Date().toISOString()
    };

    addMailLog(dispatchMail);

    try {
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: targetEmail,
          subject: dispatchMail.subject,
          body: dispatchMail.body,
          type: "STATUS_UPDATE"
        })
      });
    } catch (err) {
      console.log("API email error:", err);
    }
  };

  const pendingCount = registeredUsers.filter((u) => u.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-purple-900 text-white rounded-3xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-800 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-purple-300" />
            <span>Bandhakavi Security Control</span>
          </div>
          <h2 className="text-3xl font-extrabold">Admin Approval Dashboard</h2>
          <p className="text-purple-200 text-sm max-w-xl">
            Manage user registration sign-ups, review relations, and approve/reject account login access.
            Master Admin Email: <strong>{ADMIN_EMAIL}</strong>
          </p>
        </div>

        <div className="bg-purple-800/80 p-4 rounded-2xl text-center border border-purple-700 min-w-[160px]">
          <div className="text-3xl font-black text-amber-300">{pendingCount}</div>
          <div className="text-xs text-purple-200 font-semibold uppercase">Pending Requests</div>
        </div>
      </div>

      {/* User Queue Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-200/80 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">User Registrations Queue</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b">
                <th className="p-3 rounded-l-xl">Applicant Name</th>
                <th className="p-3">Age & Gender</th>
                <th className="p-3">Gotra</th>
                <th className="p-3">Hierarchy Relation Details</th>
                <th className="p-3">Contact (Email & Phone)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registeredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-400 text-xs">
                    No user registration requests found.
                  </td>
                </tr>
              ) : (
                registeredUsers.map((u, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">
                      <div>{u.name}</div>
                      {u.isAdmin && (
                        <span className="inline-block mt-0.5 text-[9px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                          Master Admin
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-700">
                      {u.age || "N/A"} yrs • {u.gender}
                    </td>
                    <td className="p-3 font-semibold text-amber-800">{u.gotra}</td>
                    <td className="p-3 max-w-xs text-slate-700 font-medium leading-relaxed">
                      {u.relation}
                    </td>
                    <td className="p-3 text-slate-600 text-xs">
                      <div className="font-semibold text-slate-900">{u.email}</div>
                      <div className="text-slate-500">{u.phone}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          u.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : u.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      {u.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAdminApproval(u.email, "approved")}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAdminApproval(u.email, "rejected")}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            handleAdminApproval(
                              u.email,
                              u.status === "approved" ? "rejected" : "approved"
                            )
                          }
                          className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-xs underline"
                        >
                          Toggle Status
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Notification Dispatch Log */}
      <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 border border-slate-800 space-y-4">
        <h4 className="font-bold text-amber-400 text-sm uppercase tracking-wider flex items-center space-x-2">
          <Mail className="w-4 h-4" />
          <span>Real-time Simulated & API Email Service Log ({ADMIN_EMAIL})</span>
        </h4>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {mailLogs.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              No email dispatches logged yet. Try signing up a new user to test email notifications.
            </p>
          ) : (
            mailLogs.map((m, i) => (
              <div key={i} className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-xs space-y-1">
                <div className="flex justify-between font-bold text-amber-300">
                  <span>TO: {m.to}</span>
                  <span className="text-[10px] text-slate-400">{m.timestamp?.split("T")[1]?.slice(0, 8)}</span>
                </div>
                <div className="font-semibold text-slate-200">{m.subject}</div>
                <p className="text-slate-300 whitespace-pre-line text-[11px] font-mono bg-slate-900/60 p-2 rounded-lg">
                  {m.body}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
