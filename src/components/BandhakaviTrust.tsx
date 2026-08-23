"use client";

import React from "react";
import { Building2, Award, Compass, Users, UserCheck, Mail, Sparkles } from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/firebase";

export default function BandhakaviTrust() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Bandhakavi Educational & Charitable Trust</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Preserving Heritage, Empowering Youth
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Established to foster educational support for family members, preserve ancient palm-leaf manuscripts, organize annual family reunions (*Samagam*), and extend welfare assistance.
          </p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-center w-full md:w-auto min-w-[240px]">
          <div className="text-3xl font-black text-amber-900">100+</div>
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-1">
            Active Beneficiaries & Lineage Members
          </div>
        </div>
      </div>

      {/* Core Initiatives Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5 text-amber-700" />
          </div>
          <h4 className="font-bold text-slate-900">Youth Merit Scholarships</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Providing annual financial grants to bright students of the Bandhakavi lineage pursuing higher education in medicine, engineering, technology, and Vedic sciences.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5 text-orange-700" />
          </div>
          <h4 className="font-bold text-slate-900">Digital Archive & Vamsha Tree</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Digitizing historical family documents, ancestral land deeds, and maintaining an interactive real-time pedigree tree for upcoming generations.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:shadow-md transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5 text-amber-700" />
          </div>
          <h4 className="font-bold text-slate-900">Annual Family Samagam</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Organizing annual physical and virtual gatherings to connect family members living across India and globally.
          </p>
        </div>
      </div>

      {/* Trust Management Board Section (Prepared for updating management details at a later point of time) */}
      <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-amber-700" />
              <span>Trust Management Board</span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Board of Trustees & Committee Members (Management details will be updated periodically)
            </p>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
            Trust Status: Active & Registered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Member 1 */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
              BD
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm">Bandhakavi Dattatreya Sastri</h5>
              <p className="text-xs text-amber-800 font-medium">Lead Admin & Digital Archival Head</p>
              <p className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                <Mail className="w-3 h-3 text-amber-600" />
                <span>{ADMIN_EMAIL}</span>
              </p>
            </div>
          </div>

          {/* Member 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-sm">
              BV
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm">Bandhakavi Viswanatham</h5>
              <p className="text-xs text-slate-600 font-medium">Managing Trustee</p>
              <p className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                <Mail className="w-3 h-3 text-slate-500" />
                <span>viswanatham@bandhakavi.org</span>
              </p>
            </div>
          </div>

          {/* Member 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-sm">
              BS
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-sm">Bandhakavi Surya Narayana</h5>
              <p className="text-xs text-slate-600 font-medium">Honorary Patron</p>
              <p className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                <Mail className="w-3 h-3 text-slate-500" />
                <span>suryanarayana@bandhakavi.org</span>
              </p>
            </div>
          </div>

        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
          <Sparkles className="w-4 h-4 mx-auto text-amber-600 mb-1" />
          <span>Additional management committee details and advisory board members will be added at a later point in time.</span>
        </div>
      </div>
    </div>
  );
}
