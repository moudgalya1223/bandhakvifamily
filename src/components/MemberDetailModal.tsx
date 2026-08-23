import React, { useState } from "react";
import { XCircle, Trash2, AlertCircle, Send, CheckCircle2 } from "lucide-react";
import { FamilyMember, UserProfile } from "@/types";

interface MemberDetailModalProps {
  member: FamilyMember | null;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onDeleteMember?: (memberId: string) => void;
  onRequestDelete?: (member: FamilyMember, reason: string) => void;
}

export default function MemberDetailModal({
  member,
  onClose,
  currentUser,
  onDeleteMember,
  onRequestDelete
}: MemberDetailModalProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  if (!member) return null;

  const handleDeleteClick = () => {
    if (confirm(`Are you sure you want to permanently delete "${member.name}" from the family tree?`)) {
      if (onDeleteMember) {
        onDeleteMember(member.id);
        onClose();
      }
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteReason.trim()) return;

    if (onRequestDelete) {
      onRequestDelete(member, deleteReason.trim());
      setRequestSent(true);
      setTimeout(() => {
        setRequestSent(false);
        setShowRequestForm(false);
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-amber-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <XCircle className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white text-2xl font-black flex items-center justify-center shadow-md">
            {member.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{member.name}</h3>
            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{member.relation}</p>
            <span className="inline-block mt-1 text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
              Generation {member.generation || 1}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-800 py-4">
          <div>
            <strong className="text-slate-900 dark:text-slate-100">Gotra:</strong> {member.gotra || "Moudgalya"}
          </div>
          <div>
            <strong className="text-slate-900 dark:text-slate-100">Gender:</strong> {member.gender}
          </div>
          <div>
            <strong className="text-slate-900 dark:text-slate-100">Spouse:</strong> {member.spouse || "N/A"}
          </div>
          <div>
            <strong className="text-slate-900 dark:text-slate-100">Bio & Heritage:</strong>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              {member.bio || "Member of the Bandhakavi family lineage."}
            </p>
          </div>
          {member.email && (
            <div>
              <strong className="text-slate-900 dark:text-slate-100">Email:</strong> {member.email}
            </div>
          )}
          {member.phone && (
            <div>
              <strong className="text-slate-900 dark:text-slate-100">Phone:</strong> {member.phone}
            </div>
          )}
        </div>

        {/* Delete Request Form Section */}
        {showRequestForm && !requestSent && (
          <form onSubmit={handleRequestSubmit} className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Send Deletion Request to Admin</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Please state why this member should be removed (e.g. duplicate entry, spelling error, etc.):
            </p>
            <textarea
              required
              rows={2}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Reason for deletion request..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Request</span>
              </button>
            </div>
          </form>
        )}

        {requestSent && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Deletion request submitted to Master Admin for approval!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {currentUser?.isAdmin ? (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Member (Admin)</span>
              </button>
            ) : currentUser ? (
              !showRequestForm && !requestSent && (
                <button
                  type="button"
                  onClick={() => setShowRequestForm(true)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition border border-slate-200 dark:border-slate-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Request Deletion</span>
                </button>
              )
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
