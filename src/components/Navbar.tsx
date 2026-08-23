"use client";

import React from "react";
import {
  Trees,
  BookOpen,
  Building2,
  HeartHandshake,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut
} from "lucide-react";
import { UserProfile } from "@/types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode: "login" | "signup") => void;
  onLogout: () => void;
  pendingUsersCount: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  pendingUsersCount
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo & Brand Title */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setActiveTab("tree")}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Trees className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-orange-800 bg-clip-text text-transparent">
              Bandhakavi
            </h1>
            <p className="text-xs font-semibold tracking-wider text-amber-700/80 uppercase">
              Family Hierarchy & Trust Portal
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <button
            onClick={() => setActiveTab("tree")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "tree"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-slate-600 hover:bg-amber-100/60 hover:text-amber-900"
            }`}
          >
            <Trees className="w-4 h-4" />
            <span>Family Tree</span>
          </button>

          <button
            onClick={() => setActiveTab("moudgalya")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "moudgalya"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-slate-600 hover:bg-amber-100/60 hover:text-amber-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Moudgalya Gotra</span>
          </button>

          <button
            onClick={() => setActiveTab("trust")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "trust"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-slate-600 hover:bg-amber-100/60 hover:text-amber-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Bandhakavi Trust</span>
          </button>

          <button
            onClick={() => setActiveTab("donate")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "donate"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-slate-600 hover:bg-amber-100/60 hover:text-amber-900"
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Donate</span>
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "admin"
                ? "bg-purple-700 text-white shadow-md shadow-purple-700/30"
                : "text-purple-700 bg-purple-50 hover:bg-purple-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Approvals</span>
            {pendingUsersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                {pendingUsersCount}
              </span>
            )}
          </button>
        </nav>

        {/* User Auth Profile Button */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <div className="flex items-center space-x-3 bg-amber-50 border border-amber-200 py-1.5 px-3 rounded-2xl">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-amber-900">{currentUser.name}</div>
                <div className="text-[10px] text-amber-700 capitalize font-medium">
                  {currentUser.relation || "Verified Member"}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-amber-800 hover:bg-amber-200/60 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth("login")}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth("signup")}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md shadow-amber-600/20 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 bg-amber-50/50 border-t border-amber-200/40 space-x-2 text-xs font-medium scrollbar-none">
        <button
          onClick={() => setActiveTab("tree")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "tree" ? "bg-amber-600 text-white font-bold" : "text-slate-700"
          }`}
        >
          Family Tree
        </button>
        <button
          onClick={() => setActiveTab("moudgalya")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "moudgalya" ? "bg-amber-600 text-white font-bold" : "text-slate-700"
          }`}
        >
          Moudgalya Gotra
        </button>
        <button
          onClick={() => setActiveTab("trust")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "trust" ? "bg-amber-600 text-white font-bold" : "text-slate-700"
          }`}
        >
          Trust Portal
        </button>
        <button
          onClick={() => setActiveTab("donate")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "donate" ? "bg-amber-600 text-white font-bold" : "text-slate-700"
          }`}
        >
          Donate
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "admin"
              ? "bg-purple-700 text-white font-bold"
              : "text-purple-800 bg-purple-100"
          }`}
        >
          Admin ({pendingUsersCount})
        </button>
      </div>
    </header>
  );
}
