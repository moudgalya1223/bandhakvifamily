"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Search,
  Plus,
  Crown,
  ChevronRight,
  XCircle
} from "lucide-react";
import { FamilyMember } from "@/types";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";

const INITIAL_FAMILY_DATA: FamilyMember[] = [
  {
    id: "m-1",
    name: "Bandhakavi Venkata Subbaraya Sastri",
    generation: 1,
    gender: "Male",
    gotra: "Moudgalya",
    relation: "Patriarch & Vedic Scholar (1st Gen)",
    parentId: null,
    spouse: "Smt. Annapurnamma",
    bio: "Renowned Vedic Scholar and progenitor of the modern Bandhakavi lineage.",
    phone: "+91 98765 00001",
    email: "patriarch.subbaraya@bandhakavi.org",
    status: "approved"
  },
  {
    id: "m-2",
    name: "Bandhakavi Ramakrishna Sharma",
    generation: 2,
    gender: "Male",
    gotra: "Moudgalya",
    relation: "Eldest Son of Subbaraya Sastri",
    parentId: "m-1",
    spouse: "Smt. Lakshmi Narasamma",
    bio: "Promoted Veda Pathashala initiatives and Telugu metric poetry.",
    phone: "+91 98765 00002",
    email: "ramakrishna@bandhakavi.org",
    status: "approved"
  },
  {
    id: "m-3",
    name: "Bandhakavi Surya Narayana",
    generation: 2,
    gender: "Male",
    gotra: "Moudgalya",
    relation: "Second Son of Subbaraya Sastri",
    parentId: "m-1",
    spouse: "Smt. Satyavathi",
    bio: "Founding member of Bandhakavi Educational & Charitable Trust.",
    phone: "+91 98765 00003",
    email: "suryanarayana@bandhakavi.org",
    status: "approved"
  },
  {
    id: "m-4",
    name: "Bandhakavi Dattatreya Sastri",
    generation: 3,
    gender: "Male",
    gotra: "Moudgalya",
    relation: "Grandson (Son of Ramakrishna) / Lead Admin",
    parentId: "m-2",
    spouse: "Smt. Radhadevi",
    bio: "Lead Digital Archivist and Software Leader for Bandhakavi Family Trust.",
    phone: "+91 98765 00004",
    email: "dattu99amm@gmail.com",
    status: "approved"
  },
  {
    id: "m-5",
    name: "Bandhakavi Viswanatham",
    generation: 3,
    gender: "Male",
    gotra: "Moudgalya",
    relation: "Grandson (Son of Surya Narayana)",
    parentId: "m-3",
    spouse: "Smt. Suseela",
    bio: "Managing Trustee, overseeing heritage conservation & youth education.",
    phone: "+91 98765 00005",
    email: "viswanatham@bandhakavi.org",
    status: "approved"
  },
  {
    id: "m-6",
    name: "Bandhakavi Sai Teja",
    generation: 4,
    gender: "Male",
    gotra: "Moudgalya",
    relation: "Great-Grandson (Son of Dattatreya)",
    parentId: "m-4",
    spouse: "Single",
    bio: "Tech Enthusiast and contributor to family digital initiatives.",
    phone: "+91 98765 00006",
    email: "saiteja@bandhakavi.org",
    status: "approved"
  }
];

interface FamilyTreeProps {
  onSelectMember: (member: FamilyMember) => void;
}

export default function FamilyTree({ onSelectMember }: FamilyTreeProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    gender: "Male" as "Male" | "Female" | "Other",
    gotra: "Moudgalya",
    relation: "",
    parentId: "m-1",
    spouse: "",
    bio: "",
    email: "",
    phone: ""
  });

  // Asynchronous real-time sync with Firestore family_members collection
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, "family_members"),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: FamilyMember[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...docSnap.data() } as FamilyMember);
            });
            setFamilyMembers(list);
          }
        },
        (err) => console.log("Firestore tree listener info:", err)
      );
      return () => unsub();
    } catch (err) {
      console.log("Firestore setup error:", err);
    }
  }, []);

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    const parentNode = familyMembers.find((m) => m.id === newMember.parentId);
    const calculatedGen = parentNode ? parentNode.generation + 1 : 1;

    const memberToSave: FamilyMember = {
      id: `m-${Date.now()}`,
      name: newMember.name.trim(),
      gender: newMember.gender,
      gotra: newMember.gotra.trim() || "Moudgalya",
      relation: newMember.relation.trim() || "Family Member",
      parentId: newMember.parentId,
      spouse: newMember.spouse.trim() || "N/A",
      bio: newMember.bio.trim() || "Bandhakavi Lineage Member",
      email: newMember.email.trim(),
      phone: newMember.phone.trim(),
      generation: calculatedGen,
      status: "approved"
    };

    try {
      await setDoc(doc(db, "family_members", memberToSave.id), memberToSave);
    } catch (err) {
      console.log("Error saving member to Firestore:", err);
    }

    setFamilyMembers((prev) => [...prev, memberToSave]);
    setShowAddModal(false);
    setNewMember({
      name: "",
      gender: "Male",
      gotra: "Moudgalya",
      relation: "",
      parentId: "m-1",
      spouse: "",
      bio: "",
      email: "",
      phone: ""
    });
  };

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return familyMembers;
    const q = searchQuery.toLowerCase();
    return familyMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.relation.toLowerCase().includes(q) ||
        m.gotra.toLowerCase().includes(q)
    );
  }, [familyMembers, searchQuery]);

  const generationGroups = useMemo(() => {
    const groups: Record<number, FamilyMember[]> = {};
    filteredMembers.forEach((m) => {
      const gen = m.generation || 1;
      if (!groups[gen]) groups[gen] = [];
      groups[gen].push(m);
    });
    return groups;
  }, [filteredMembers]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden transition-colors">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-100/50 dark:bg-amber-900/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Asynchronous Vamsha Tree</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Bandhakavi Hierarchy Family Tree
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Explore our ancestral lineage across generations. Synced in real-time with Firebase. Click any member to view full details or add direct lineage descendants.
          </p>
        </div>

        {/* Controls & Search */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name or relation..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 text-sm outline-none transition"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lineage Member</span>
          </button>
        </div>
      </div>

      {/* Tree Render Container */}
      <div className="bg-slate-900/95 dark:bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl overflow-x-auto min-h-[500px]">
        <div className="min-w-[700px] flex flex-col items-center space-y-12 py-4">
          {Object.keys(generationGroups)
            .sort((a, b) => Number(a) - Number(b))
            .map((genKey) => (
              <div key={genKey} className="w-full flex flex-col items-center">
                {/* Generation Label */}
                <div className="mb-6 flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Generation {genKey}</span>
                </div>

                {/* Members Cards Row */}
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                  {generationGroups[Number(genKey)].map((member) => (
                    <div
                      key={member.id}
                      onClick={() => onSelectMember(member)}
                      className="group relative bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/80 rounded-2xl p-5 w-64 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
                          {member.name.charAt(0)}
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-amber-300">
                          Gotra: {member.gotra || "Moudgalya"}
                        </span>
                      </div>

                      <div className="mt-3">
                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition line-clamp-1">
                          {member.name}
                        </h4>
                        <p className="text-xs text-amber-400/90 font-medium mt-0.5 line-clamp-1">
                          {member.relation}
                        </p>
                      </div>

                      {member.spouse && (
                        <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Spouse:</span>
                          <span className="font-medium text-slate-300">{member.spouse}</span>
                        </div>
                      )}

                      <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>ID: #{member.id}</span>
                        <span className="text-amber-400/80 flex items-center gap-1 group-hover:underline">
                          View profile <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vertical Connector Line */}
                {Number(genKey) < Object.keys(generationGroups).length && (
                  <div className="w-0.5 h-10 bg-gradient-to-b from-amber-500/50 to-amber-500/10 my-4" />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-amber-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4">Add Lineage Member to Tree</h3>

            <form onSubmit={handleAddMemberSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                  placeholder="e.g. Bandhakavi Somayajulu"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Gender</label>
                  <select
                    value={newMember.gender}
                    onChange={(e) => setNewMember({ ...newMember, gender: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Gotra</label>
                  <input
                    type="text"
                    value={newMember.gotra}
                    onChange={(e) => setNewMember({ ...newMember, gotra: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Parent Node in Tree *</label>
                <select
                  value={newMember.parentId || ""}
                  onChange={(e) => setNewMember({ ...newMember, parentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Gen {m.generation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Relation Title</label>
                <input
                  type="text"
                  value={newMember.relation}
                  onChange={(e) => setNewMember({ ...newMember, relation: e.target.value })}
                  placeholder="e.g. Great-Grandson"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Spouse Name</label>
                <input
                  type="text"
                  value={newMember.spouse}
                  onChange={(e) => setNewMember({ ...newMember, spouse: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Short Biography</label>
                <textarea
                  rows={2}
                  value={newMember.bio}
                  onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Save Member to Tree (Asynchronous Sync)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
