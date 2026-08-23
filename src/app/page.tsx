"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import FamilyTree from "@/components/FamilyTree";
import MoudgalyaGotra from "@/components/MoudgalyaGotra";
import BandhakaviTrust from "@/components/BandhakaviTrust";
import DonatePortal from "@/components/DonatePortal";
import AdminPanel from "@/components/AdminPanel";
import MemberDetailModal from "@/components/MemberDetailModal";
import { UserProfile, FamilyMember, MailLog } from "@/types";
import { ADMIN_EMAIL, db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const INITIAL_REGISTERED_USERS: UserProfile[] = [
  {
    name: "Bandhakavi Dattatreya Sastri",
    age: "38",
    gender: "Male",
    gotra: "Moudgalya",
    email: "dattu99amm@gmail.com",
    phone: "+91 98765 00004",
    relation: "Grandson of Ramakrishna Sharma / Master Admin",
    status: "approved",
    isAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    name: "Bandhakavi Lakshmi Narayana",
    age: "42",
    gender: "Male",
    gotra: "Moudgalya",
    email: "lakshminarayana@gmail.com",
    phone: "+91 99887 76655",
    relation: "Grandson of Subbaraya Sastri",
    status: "pending",
    isAdmin: false,
    createdAt: new Date().toISOString()
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("tree"); // 'tree' | 'moudgalya' | 'trust' | 'donate' | 'admin'
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Auth Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup" | "pending">("login");
  
  // Selected Tree Member detail modal
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // Live Users state (synced with Firestore)
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(INITIAL_REGISTERED_USERS);
  
  // Live Email Logs
  const [mailLogs, setMailLogs] = useState<MailLog[]>([]);

  // Sync users from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: UserProfile[] = [];
            snapshot.forEach((docSnap) => {
              list.push(docSnap.data() as UserProfile);
            });
            setRegisteredUsers(list);
          }
        },
        (err) => console.log("Firestore users listener info:", err)
      );
      return () => unsub();
    } catch (err) {
      console.log("Firestore setup info:", err);
    }
  }, []);

  const handleOpenAuth = (mode: "login" | "signup" | "pending") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addMailLog = (log: MailLog) => {
    setMailLogs((prev) => [log, ...prev]);
  };

  const pendingUsersCount = registeredUsers.filter((u) => u.status === "pending").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 text-slate-800 font-sans flex flex-col">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        pendingUsersCount={pendingUsersCount}
      />

      {/* Main Page View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "tree" && (
          <FamilyTree onSelectMember={(member) => setSelectedMember(member)} />
        )}

        {activeTab === "moudgalya" && <MoudgalyaGotra />}

        {activeTab === "trust" && <BandhakaviTrust />}

        {activeTab === "donate" && <DonatePortal />}

        {activeTab === "admin" && (
          <AdminPanel
            registeredUsers={registeredUsers}
            setRegisteredUsers={setRegisteredUsers}
            mailLogs={mailLogs}
            addMailLog={addMailLog}
            onUserApproved={(approvedUser) => {
              console.log("User approved by admin:", approvedUser);
            }}
          />
        )}
      </main>

      {/* Auth Modal (Login / Sign Up / Pending) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={(user) => setCurrentUser(user)}
        registeredUsers={registeredUsers}
        setRegisteredUsers={setRegisteredUsers}
        addMailLog={addMailLog}
      />

      {/* Tree Member Detail Modal */}
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-amber-400 font-bold">
            Bandhakavi Family Hierarchy & Educational Trust
          </p>
          <p>
            Admin Contact:{" "}
            <a href={`mailto:${ADMIN_EMAIL}`} className="underline text-slate-200 font-semibold">
              {ADMIN_EMAIL}
            </a>
          </p>
          <p className="text-[10px] text-slate-500">
            © {new Date().getFullYear()} Bandhakavi Family Trust. Built with Next.js App Router & Firebase.
          </p>
        </div>
      </footer>
    </div>
  );
}
