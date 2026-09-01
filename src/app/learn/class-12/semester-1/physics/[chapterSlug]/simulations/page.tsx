'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Sparkles, Sliders, Layers, ArrowRight } from 'lucide-react';
import ElectricFlux3D from '@/components/simulations/components/ElectricFlux3D';
import CapacitorDielectric from '@/components/simulations/components/CapacitorDielectric';
import ProjectileMotion from '@/components/simulations/components/ProjectileMotion';

export default function SimulationsPage() {
  const params = useParams();
  const chapterSlug = params.chapterSlug as string;

  const [activeSim, setActiveSim] = useState<'FLUX' | 'CAPACITOR' | 'PROJECTILE'>('FLUX');

  const simTabs = [
    {
      id: 'FLUX' as const,
      title: '3D Electric Flux Visualizer',
      titleBn: 'ত্রিমাত্রিক তড়িৎ ফ্লাক্স সিমুলেশন',
      desc: 'Vector field lines piercing planar areas in 3D coordinate axes.',
    },
    {
      id: 'CAPACITOR' as const,
      title: 'Capacitor & Dielectric Slab',
      titleBn: 'ধারক ও পরাবৈদ্যুতিক মাধ্যম',
      desc: 'Interactive plate separation and slab insertion with live electric field and energy meters.',
    },
    {
      id: 'PROJECTILE' as const,
      title: 'Projectile Motion Trajectory',
      titleBn: 'প্রাসের গতি ও গতিপথ',
      desc: 'Launch angle, velocity, range, maximum height, and multi-gravity simulation.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href={`/learn/class-12/semester-1/physics/${chapterSlug}/practice`} className="hover:text-amber-400 transition flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to MCQ Practice</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Interactive Physics Simulation Sandbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-bengali">
            হাতে-কলমে পরীক্ষা করে পদার্থবিদ্যার প্রতিটি সূত্র ও বাস্তব ধারণাকে উপলব্ধি করুন
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {simTabs.map((tab) => {
          const isActive = activeSim === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSim(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-1.5 ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isActive ? 'text-amber-400' : 'text-slate-200'}`}>
                  {tab.title}
                </span>
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-400" />}
              </div>
              <p className="text-[11px] font-bengali text-slate-300 font-medium">
                {tab.titleBn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Simulation Viewport */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
        {activeSim === 'FLUX' && (
          <ElectricFlux3D params={{ fieldVector: [3, -4, 2], plane: 'YZ', side: 2 }} />
        )}
        {activeSim === 'CAPACITOR' && (
          <CapacitorDielectric params={{ initialDielectric: 2, finalDielectric: 4, initialDistance: 2 }} />
        )}
        {activeSim === 'PROJECTILE' && (
          <ProjectileMotion params={{ velocity: 25, angle: 45, gravity: 9.8 }} />
        )}
      </div>

    </div>
  );
}
