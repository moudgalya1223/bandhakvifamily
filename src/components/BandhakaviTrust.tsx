"use client";

import React from "react";
import { Building2, Award, Compass, Users, UserCheck, Mail, Sparkles } from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/firebase";

export default function BandhakaviTrust() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-amber-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 transition-colors">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Bandhakavi Educational & Charitable Trust</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Preserving Heritage, Empowering Youth
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Established to foster educational support for family members, preserve ancient palm-leaf manuscripts, organize annual family reunions (*Samagam*), and extend welfare assistance.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-slate-800/80 rounded-2xl p-6 border border-amber-200 dark:border-slate-700 text-center w-full md:w-auto min-w-[240px]">
          <div className="text-3xl font-black text-amber-900 dark:text-amber-400">100+</div>
          <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mt-1">
            Active Beneficiaries & Lineage Members
          </div>
        </div>
      </div>

      {/* Core Initiatives Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Youth Merit Scholarships</h4>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            Providing annual financial grants to bright students of the Bandhakavi lineage pursuing higher education in medicine, engineering, technology, and Vedic sciences.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-400 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5 text-orange-700 dark:text-orange-400" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Digital Archive & Vamsha Tree</h4>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            Digitizing historical family documents, ancestral land deeds, and maintaining an interactive real-time pedigree tree for upcoming generations.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100">Annual Family Samagam</h4>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            Organizing annual physical and virtual gatherings to connect family members living across India and globally.
          </p>
        </div>
      </div>

      {/* Trust Management Board Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-amber-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <span>Trust Management Board</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              Board of Trustees & Committee Members (Management details will be updated periodically)
            </p>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-full">
            Trust Status: Active & Registered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Member 1 */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
              BD
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Bandhakavi Dattatreya Sastri</h5>
              <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">Lead Admin & Digital Archival Head</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-0.5">
                <Mail className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>admin@bandhakavi.org</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400">
          <Sparkles className="w-4 h-4 mx-auto text-amber-600 dark:text-amber-400 mb-1" />
          <span>Additional management committee details and advisory board members will be added at a later point in time.</span>
        </div>
      </div>
    </div>
  );
}
