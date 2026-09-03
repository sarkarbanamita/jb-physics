'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Sparkles, Sliders, Layers, ArrowRight } from 'lucide-react';
import ElectricFlux3D from '@/components/simulations/components/ElectricFlux3D';
import CapacitorDielectric from '@/components/simulations/components/CapacitorDielectric';
import ProjectileMotion from '@/components/simulations/components/ProjectileMotion';
import DriftVelocityResistance from '@/components/simulations/components/DriftVelocityResistance';
import MagneticFieldCurrents from '@/components/simulations/components/MagneticFieldCurrents';
import CircuitInstruments from '@/components/simulations/components/CircuitInstruments';
import EarthMagnetismDipole from '@/components/simulations/components/EarthMagnetismDipole';
import ACCircuitsEMWaves from '@/components/simulations/components/ACCircuitsEMWaves';

export default function SimulationsPage() {
  const params = useParams();
  const chapterSlug = params.chapterSlug as string;

  const [activeSim, setActiveSim] = useState<
    'FLUX' | 'CAPACITOR' | 'DRIFT' | 'MAGNET' | 'CIRCUITS' | 'EARTH' | 'AC_EM' | 'PROJECTILE'
  >('FLUX');

  const simTabs = [
    {
      id: 'FLUX' as const,
      title: '3D Electric Flux',
      titleBn: 'ত্রিমাত্রিক তড়িৎ ফ্লাক্স',
      desc: 'Q1, Q10: Dot product E·A through planes & square loops in 3D.',
    },
    {
      id: 'CAPACITOR' as const,
      title: 'Capacitors & Dielectrics',
      titleBn: 'ধারক ও পরাবৈদ্যুতিক মাধ্যম',
      desc: 'Q2, Q3, Q20: Slab insertion (k=4), charge sharing & series divider.',
    },
    {
      id: 'DRIFT' as const,
      title: 'Drift & Wire Stretching',
      titleBn: 'বিচলন বেগ ও তারের রোধ (x²R)',
      desc: 'Q4, Q5, Q29: Electron drift velocity, volume conservation & I-V slopes.',
    },
    {
      id: 'MAGNET' as const,
      title: 'Biot-Savart & Mag. Forces',
      titleBn: 'বায়ো-সাভার্ট ও চৌম্বক বল',
      desc: 'Q6, Q8, Q13, Q14: Semicircular loop, solenoid & parallel wires force.',
    },
    {
      id: 'CIRCUITS' as const,
      title: 'Potentiometer & Meters',
      titleBn: 'পোটেনশিওমিটার ও মিটার শান্ট',
      desc: 'Q7, Q15, Q27, Q30: Potentiometer 790Ω balance, 20Ω shunt, parallel cells 2.6V.',
    },
    {
      id: 'EARTH' as const,
      title: 'Earth Magnetism & Dipole',
      titleBn: 'ভূ-চুম্বকত্ব ও দ্বিমেরু ভ্রামক',
      desc: 'Q9, Q11, Q12, Q16, Q17, Q18: Dip circle tanθ=2, bent wire 2M/π, null points.',
    },
    {
      id: 'AC_EM' as const,
      title: 'AC Circuits, Transformer & EM',
      titleBn: 'ট্রান্সফরমার, ac বর্তনী ও 3D EM Wave',
      desc: 'Q21–Q25, Q31–Q35: 3D E×B wave, transformer 1000 turns, LCR resonance.',
    },
    {
      id: 'PROJECTILE' as const,
      title: 'Projectile Motion',
      titleBn: 'প্রাসের গতি ও গতিপথ',
      desc: 'Interactive trajectory sandbox with angle & velocity sliders.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href={`/learn/class-12/semester-1/physics/${chapterSlug || 'electrostatics'}/practice`} className="hover:text-amber-400 transition flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to MCQ Practice</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Class 12 Physics Interactive Simulation Sandbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-bengali">
            হাতে-কলমে পরীক্ষা করে পদার্থবিদ্যার প্রতিটি সূত্র, বিগত বছরের প্রশ্ন ও বাস্তব ধারণাকে উপলব্ধি করুন
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {simTabs.map((tab) => {
          const isActive = activeSim === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSim(tab.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 space-y-1 ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isActive ? 'text-amber-400' : 'text-slate-200'}`}>
                  {tab.title}
                </span>
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-400" />}
              </div>
              <p className="text-[11px] font-bengali text-amber-300/80 font-medium line-clamp-1">
                {tab.titleBn}
              </p>
              <p className="text-[10px] text-slate-400 line-clamp-1">
                {tab.desc}
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
        {activeSim === 'DRIFT' && (
          <DriftVelocityResistance params={{ mode: 'STRETCH', stretchFactor: 2.0 }} />
        )}
        {activeSim === 'MAGNET' && (
          <MagneticFieldCurrents params={{ mode: 'SEMICIRCLE' }} />
        )}
        {activeSim === 'CIRCUITS' && (
          <CircuitInstruments params={{ mode: 'POTENTIOMETER', balanceLength: 40 }} />
        )}
        {activeSim === 'EARTH' && (
          <EarthMagnetismDipole params={{ mode: 'DIP_CIRCLE', bvRatio: 2.0 }} />
        )}
        {activeSim === 'AC_EM' && (
          <ACCircuitsEMWaves params={{ mode: '3D_EM_WAVE' }} />
        )}
        {activeSim === 'PROJECTILE' && (
          <ProjectileMotion params={{ velocity: 25, angle: 45, gravity: 9.8 }} />
        )}
      </div>

    </div>
  );
}
