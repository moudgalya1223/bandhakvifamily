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
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { UserProfile } from "@/types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (mode: "login" | "signup") => void;
  onLogout: () => void;
  pendingUsersCount: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  pendingUsersCount,
  isDarkMode,
  toggleDarkMode
}: NavbarProps) {
  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
      isDarkMode
        ? "bg-slate-900/90 border-slate-800 text-slate-100"
        : "bg-white/90 border-amber-200/60 text-slate-800 shadow-sm"
    }`}>
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
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Bandhakavi
            </h1>
            <p className={`text-xs font-semibold tracking-wider uppercase ${
              isDarkMode ? "text-amber-400" : "text-amber-700/80"
            }`}>
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
                : isDarkMode
                ? "text-slate-300 hover:bg-slate-800 hover:text-amber-400"
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
                : isDarkMode
                ? "text-slate-300 hover:bg-slate-800 hover:text-amber-400"
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
                : isDarkMode
                ? "text-slate-300 hover:bg-slate-800 hover:text-amber-400"
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
                : isDarkMode
                ? "text-slate-300 hover:bg-slate-800 hover:text-amber-400"
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
                : isDarkMode
                ? "text-purple-300 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-800/60"
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

        {/* Theme Toggle & Auth Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Dark/Light Mode Toggle Switch */}
          <button
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-xl transition flex items-center space-x-1.5 text-xs font-bold ${
              isDarkMode
                ? "bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-200"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* User Auth Profile / Buttons */}
          {currentUser ? (
            <div className={`flex items-center space-x-3 py-1.5 px-3 rounded-2xl border ${
              isDarkMode ? "bg-slate-800/90 border-slate-700 text-slate-200" : "bg-amber-50 border-amber-200 text-amber-900"
            }`}>
              <div className="text-right hidden sm:block">
                <div className={`text-xs font-bold ${isDarkMode ? "text-amber-300" : "text-amber-900"}`}>
                  {currentUser.name}
                </div>
                <div className={`text-[10px] capitalize font-medium ${isDarkMode ? "text-slate-400" : "text-amber-700"}`}>
                  {currentUser.relation || "Verified Member"}
                </div>
              </div>
              <button
                onClick={onLogout}
                className={`p-2 rounded-xl transition ${
                  isDarkMode ? "text-amber-400 hover:bg-slate-700" : "text-amber-800 hover:bg-amber-200/60"
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuth("login")}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isDarkMode
                    ? "bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700"
                    : "text-amber-900 bg-amber-100 hover:bg-amber-200"
                }`}
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
      <div className={`md:hidden flex overflow-x-auto px-4 py-2 border-t space-x-2 text-xs font-medium scrollbar-none ${
        isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-amber-50/50 border-amber-200/40"
      }`}>
        <button
          onClick={() => setActiveTab("tree")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "tree"
              ? "bg-amber-600 text-white font-bold"
              : isDarkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Family Tree
        </button>
        <button
          onClick={() => setActiveTab("moudgalya")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "moudgalya"
              ? "bg-amber-600 text-white font-bold"
              : isDarkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Moudgalya Gotra
        </button>
        <button
          onClick={() => setActiveTab("trust")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "trust"
              ? "bg-amber-600 text-white font-bold"
              : isDarkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Trust Portal
        </button>
        <button
          onClick={() => setActiveTab("donate")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "donate"
              ? "bg-amber-600 text-white font-bold"
              : isDarkMode ? "text-slate-300" : "text-slate-700"
          }`}
        >
          Donate
        </button>
        <button
          onClick={() => setActiveTab("admin")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-lg ${
            activeTab === "admin"
              ? "bg-purple-700 text-white font-bold"
              : isDarkMode ? "text-purple-300 bg-purple-950" : "text-purple-800 bg-purple-100"
          }`}
        >
          Admin ({pendingUsersCount})
        </button>
      </div>
    </header>
  );
}
