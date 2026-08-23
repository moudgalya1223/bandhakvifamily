"use client";

import React, { useState } from "react";
import { HeartHandshake, Heart, CheckCircle2 } from "lucide-react";
import { DonationRecord } from "@/types";

const INITIAL_DONATIONS: DonationRecord[] = [
  { id: 1, name: "Bandhakavi Dattatreya", amount: 11116, cause: "Annual Samagam & Veda Pathashala", date: "2026-08-15" },
  { id: 2, name: "Viswanatham B.", amount: 5008, cause: "Trust Corpus Fund", date: "2026-08-10" },
  { id: 3, name: "Satyavathi M.", amount: 2500, cause: "Youth Education Support", date: "2026-07-28" }
];

export default function DonatePortal() {
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [donationForm, setDonationForm] = useState({
    donorName: "",
    email: "",
    amount: "5008",
    cause: "Trust Corpus Fund",
    paymentMethod: "upi"
  });
  const [donationSuccess, setDonationSuccess] = useState(false);

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationForm.donorName.trim() || !donationForm.amount) return;

    const newRecord: DonationRecord = {
      id: Date.now(),
      name: donationForm.donorName.trim(),
      amount: Number(donationForm.amount),
      cause: donationForm.cause,
      date: new Date().toISOString().split("T")[0],
      email: donationForm.email.trim(),
      paymentMethod: donationForm.paymentMethod
    };

    setDonations((prev) => [newRecord, ...prev]);
    setDonationSuccess(true);
    setTimeout(() => setDonationSuccess(false), 6000);
    setDonationForm({
      donorName: "",
      email: "",
      amount: "5008",
      cause: "Trust Corpus Fund",
      paymentMethod: "upi"
    });
  };

  const totalRaised = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Seva & Voluntary Contribution</span>
          </div>
          <h2 className="text-3xl font-extrabold">Support Bandhakavi Trust Causes</h2>
          <p className="text-amber-100 text-sm">
            Your contributions directly support family youth education, ancestral manuscript preservation, and welfare funds.
          </p>
        </div>

        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 w-full md:w-auto min-w-[200px]">
          <div className="text-3xl font-black">₹{totalRaised.toLocaleString()}</div>
          <div className="text-[11px] font-semibold text-amber-200 uppercase tracking-wider mt-0.5">
            Total Seva Raised
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Donation Form Column */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200/80 dark:border-slate-800 shadow-sm space-y-6">
          
          {donationSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Thank you! Your donation was recorded successfully. Virtual receipt generated.</span>
            </div>
          )}

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Make a Contribution</h3>

          <form onSubmit={handleDonationSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Donor Name *
              </label>
              <input
                type="text"
                value={donationForm.donorName}
                onChange={(e) => setDonationForm({ ...donationForm, donorName: e.target.value })}
                required
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Mail ID (For digital receipt)
              </label>
              <input
                type="email"
                value={donationForm.email}
                onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })}
                placeholder="donor@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Select Cause / Fund Category
              </label>
              <select
                value={donationForm.cause}
                onChange={(e) => setDonationForm({ ...donationForm, cause: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Trust Corpus Fund">Trust Corpus Fund</option>
                <option value="Annual Samagam & Veda Pathashala">Annual Samagam & Veda Pathashala</option>
                <option value="Youth Education Support">Youth Education Support</option>
                <option value="Heritage Manuscript Archiving">Heritage Manuscript Archiving</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Contribution Amount (₹)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {["1116", "2500", "5008", "11116"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDonationForm({ ...donationForm, amount: preset })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      donationForm.amount === preset
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-slate-700 hover:bg-amber-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={donationForm.amount}
                onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                required
                placeholder="Custom amount"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "upi", name: "UPI / QR Code" },
                  { id: "bank", name: "Bank Transfer" },
                  { id: "card", name: "Debit/Credit Card" }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setDonationForm({ ...donationForm, paymentMethod: pm.id })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      donationForm.paymentMethod === pm.id
                        ? "border-amber-600 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pm.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-2xl text-sm shadow-md transition"
            >
              Proceed with Seva Contribution
            </button>
          </form>
        </div>

        {/* Donors Leaderboard */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Recent Contributors</span>
            </h4>

            <div className="space-y-3">
              {donations.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{d.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {d.cause} • {d.date}
                    </div>
                  </div>
                  <div className="font-extrabold text-amber-700 dark:text-amber-400 text-sm">
                    ₹{d.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
