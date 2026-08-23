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
import { collection, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore";

const INITIAL_REGISTERED_USERS: UserProfile[] = [
  {
    name: "Bandhakavi Dattatreya Sastri",
    age: "38",
    gender: "Male",
    gotra: "Moudgalya",
    email: "dattu99amma@gmail.com",
    phone: "+91 98765 00004",
    relation: "Master Admin",
    status: "approved",
    isAdmin: true,
    createdAt: new Date().toISOString()
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("tree");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Theme state: defaults to dark mode or persisted preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Auth Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup" | "pending" | "admin">("login");
  
  // Selected Tree Member detail modal
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // Live Users state
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(INITIAL_REGISTERED_USERS);
  
  // Live Email Logs
  const [mailLogs, setMailLogs] = useState<MailLog[]>([]);

  // Toggle Dark Mode handler
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Sync users from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: UserProfile[] = [];
            snapshot.forEach((docSnap) => {
              const uData = docSnap.data();
              if (uData && typeof uData.email === "string" && uData.email.trim()) {
                list.push(uData as UserProfile);
              }
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

  const handleOpenAuth = (mode: "login" | "signup" | "pending" | "admin") => {
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
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
      isDarkMode
        ? "bg-slate-950 text-slate-100 dark"
        : "bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 text-slate-800"
    }`}>
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        pendingUsersCount={pendingUsersCount}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Page View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "tree" && (
          <FamilyTree
            onSelectMember={(member) => setSelectedMember(member)}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
          />
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
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
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
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.isAdmin) {
            setActiveTab("admin");
          }
        }}
        registeredUsers={registeredUsers}
        setRegisteredUsers={setRegisteredUsers}
        addMailLog={addMailLog}
      />

      {/* Tree Member Detail Modal */}
      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        currentUser={currentUser}
        onDeleteMember={async (memberId) => {
          try {
            await deleteDoc(doc(db, "family_members", memberId));
            setSelectedMember(null);
          } catch (err) {
            console.log("Delete error:", err);
          }
        }}
        onRequestDelete={async (member, reason) => {
          try {
            const reqId = `del-${Date.now()}`;
            await setDoc(doc(db, "delete_requests", reqId), {
              id: reqId,
              memberId: member.id,
              memberName: member.name,
              memberRelation: member.relation,
              requesterEmail: currentUser?.email || "user@bandhakavi.org",
              reason: reason,
              createdAt: new Date().toISOString(),
              status: "pending"
            });
          } catch (err) {
            console.log("Request delete error:", err);
          }
        }}
        onOpenAuth={(mode) => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Footer */}
      <footer className={`text-xs border-t py-8 mt-12 transition-colors ${
        isDarkMode
          ? "bg-slate-900 border-slate-800 text-slate-400"
          : "bg-slate-900 text-slate-400 border-slate-800"
      }`}>
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-amber-400 font-bold">
            Bandhakavi Family Hierarchy & Educational Trust
          </p>
          <p>
            Admin Contact: <span className="text-slate-200 font-semibold">Bandhakavi Family Trust Administrator</span>
          </p>
          <p className="text-[10px] text-slate-500">
            © {new Date().getFullYear()} Bandhakavi Family Trust.
          </p>
        </div>
      </footer>
    </div>
  );
}
