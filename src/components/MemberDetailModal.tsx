"use client";

import React from "react";
import { XCircle } from "lucide-react";
import { FamilyMember } from "@/types";

interface MemberDetailModalProps {
  member: FamilyMember | null;
  onClose: () => void;
}

export default function MemberDetailModal({ member, onClose }: MemberDetailModalProps) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-amber-200 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white text-2xl font-black flex items-center justify-center shadow-md">
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
            <p className="text-xs text-amber-700 font-semibold">{member.relation}</p>
            <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
              Generation {member.generation || 1}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-700 border-t border-b border-slate-100 py-4">
          <div>
            <strong className="text-slate-900">Gotra:</strong> {member.gotra || "Moudgalya"}
          </div>
          <div>
            <strong className="text-slate-900">Gender:</strong> {member.gender}
          </div>
          <div>
            <strong className="text-slate-900">Spouse:</strong> {member.spouse || "N/A"}
          </div>
          <div>
            <strong className="text-slate-900">Bio & Heritage:</strong>
            <p className="mt-1 text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {member.bio || "Member of the Bandhakavi family lineage."}
            </p>
          </div>
          {member.email && (
            <div>
              <strong className="text-slate-900">Email:</strong> {member.email}
            </div>
          )}
          {member.phone && (
            <div>
              <strong className="text-slate-900">Phone:</strong> {member.phone}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
