"use client";

import React from "react";
import { Sunrise, Scroll, Shield, Feather, BookOpen, Sparkles } from "lucide-react";

export default function MoudgalyaGotra() {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-orange-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-400/30">
            <Feather className="w-3.5 h-3.5" />
            <span>Sacred Vedic Rishi Lineage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About Moudgalya Gotra & Its Sacred Origin
          </h2>
          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Discover the ancient spiritual origins, Rigvedic hymns, Tri-Rishi Pravara, and noble heritage of Maharshi Mudgala—the venerable progenitor of the Moudgalya Gotra.
          </p>
        </div>
      </div>

      {/* Grid of Origin & Heritage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Rishi Mudgala & Tapas */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/70 shadow-sm space-y-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
            <Sunrise className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Rishi Mudgala & Virtues</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            The Moudgalya Gotra traces its lineage to <strong>Maharshi Mudgala</strong>, the Vedic sage revered in the <em>Rigveda</em>, <em>Mahabharata (Vana Parva)</em>, and <em>Puranas</em>. Known for his intense spiritual penance (*tapas*), supreme detachment (*vairagya*), and generous hospitality (*dharma*), Maharshi Mudgala earned the rare honor of ascending directly to heavenly realms in his mortal body.
          </p>
        </div>

        {/* Card 2: Rigveda Hymns */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/70 shadow-sm space-y-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xl">
            <Scroll className="w-6 h-6 text-orange-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Rigvedic Hymns (Mandala X)</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Hymn 102 of the 10th Mandala in the <em>Rigveda</em> is attributed directly to Mudgala Bharmyasva. It recounts the famous spiritual victory where Mudgala, driving a simple wooden cart pulled by a bull, overcame all adversaries through righteousness and Vedic mantras, symbolizing faith triumphing over adversity.
          </p>
        </div>

        {/* Card 3: Tri-Rishi Pravara */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/70 shadow-sm space-y-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
            <Shield className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Tri-Rishi Pravara</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            The sacred Pravara recited by descendants of Moudgalya Gotra during Vedic rituals invokes three illustrious Rishis:
            <strong className="block mt-2 text-amber-900 font-semibold">1. Maharshi Angirasa</strong>
            <strong className="block text-amber-900 font-semibold">2. Maharshi Bharmyasva</strong>
            <strong className="block text-amber-900 font-semibold">3. Maharshi Moudgalya</strong>
            This lineage blends profound Vedic scholarship with spiritual fortitude.
          </p>
        </div>

      </div>

      {/* Rishi Visual Cards Section */}
      <div className="bg-white rounded-3xl p-8 border border-amber-200/80 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h3 className="text-2xl font-extrabold text-slate-900">Revered Ancestral Rishis</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Rishi Card 1 */}
          <div className="rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/50 p-6 border border-amber-200/80 text-center space-y-3">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-700 via-orange-600 to-amber-500 p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-amber-900 flex items-center justify-center text-white text-3xl font-black">
                ऋषि
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Maharshi Mudgala</h4>
            <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
              Progenitor of Moudgalya Lineage
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Master of Vedic wisdom and penance. Celebrated in Vedic texts for unwavering righteousness and hospitality to all seekers.
            </p>
          </div>

          {/* Rishi Card 2 */}
          <div className="rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/50 p-6 border border-amber-200/80 text-center space-y-3">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-700 via-orange-600 to-amber-500 p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-amber-900 flex items-center justify-center text-white text-3xl font-black">
                अंगिरस्
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Maharshi Angirasa</h4>
            <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
              Saptarishi & Pravara Ancestor
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              One of the ten Saptarishis created by Brahma, father of Agni and divine preceptor of spiritual knowledge.
            </p>
          </div>

          {/* Rishi Card 3 */}
          <div className="rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/50 p-6 border border-amber-200/80 text-center space-y-3">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-700 via-orange-600 to-amber-500 p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-amber-900 flex items-center justify-center text-white text-3xl font-black">
                भ्रम्याश्व
              </div>
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Maharshi Bharmyasva</h4>
            <p className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
              Panchala Vedic Seer
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Illustrious Vedic king-sage of the Panchala realm and direct father of Rishi Mudgala.
            </p>
          </div>

        </div>
      </div>

      {/* About Us Paragraph - Bandhakavi Connection */}
      <div className="bg-amber-500/10 rounded-3xl p-8 border border-amber-200/80 space-y-4">
        <h3 className="text-xl font-bold text-amber-950 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-amber-700" />
          <span>About Us: The Bandhakavi Lineage Connection</span>
        </h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
          Members of the <strong>Bandhakavi</strong> family belong to this venerated Moudgalya Gotra lineage. Hailing from South India across generations of Vedic scholars, poets, and community pillars, the Bandhakavi family has preserved ancient traditions of sacred learning, literature, and social contribution. The family surname <em>Bandhakavi</em> honors a distinguished ancestor who achieved mastery in composing complex metric poetry (*Bandha Kavitha*) in Sanskrit and Telugu. Today, our extended family spans across the globe, united by our shared heritage, commitment to education, and reverence for Maharshi Mudgala's ideals.
        </p>
      </div>
    </div>
  );
}
