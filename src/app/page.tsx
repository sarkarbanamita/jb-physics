import React from 'react';
import Link from 'next/link';
import {
  Atom,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Flame,
  Languages,
  Sparkles,
  Youtube,
  Send,
  MessageCircle,
  Zap,
  Compass,
  ShieldCheck,
  Award,
  Play,
} from 'lucide-react';
import SimulationContainer from '@/components/simulations/SimulationContainer';

export default function HomePage() {
  const chapters = [
    {
      titleEn: 'Unit 1: Electrostatics',
      titleBn: 'অধ্যায় ১: স্থির তড়িৎ ও ক্ষেত্র',
      slug: 'electrostatics',
      icon: Atom,
      color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
      descriptionEn: 'Electric field vectors, Gauss theorem, electric flux, capacitors & dielectrics.',
      descriptionBn: 'তড়িৎক্ষেত্র, গাউসের সূত্র, তড়িৎ ফ্লাক্স, ধারক ও পরাবৈদ্যুতিক মাধ্যম।',
      simType: 'ELECTRIC_FLUX_3D',
    },
    {
      titleEn: 'Unit 2: Current Electricity',
      titleBn: 'অধ্যায় ২: প্রবাহী তড়িৎ',
      slug: 'current-electricity',
      icon: Zap,
      color: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30',
      descriptionEn: 'Drift velocity, Ohm law, potentiometer, circuit rules & resistance.',
      descriptionBn: 'বিচলন বেগ, ওহমের সূত্র, পোটেনশিওমিটার, মিটার ও রোধাঙ্ক।',
      simType: 'DRIFT_AND_RESISTANCE',
    },
    {
      titleEn: 'Unit 3: Magnetic Effects & Magnetism',
      titleBn: 'অধ্যায় ৩: তড়িৎপ্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব',
      slug: 'magnetism',
      icon: Compass,
      color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30',
      descriptionEn: 'Biot-Savart law, Solenoids, Lorentz force, Earth magnetism & dip angles.',
      descriptionBn: 'বায়ো-সাভার্ট সূত্র, সলিনয়েড, লরেঞ্জ বল ও ভূ-চুম্বকত্ব।',
      simType: 'MAGNETIC_FIELD_CURRENTS',
    },
    {
      titleEn: 'Unit 4: EMI & Alternating Current',
      titleBn: 'অধ্যায় ৪: তড়িৎচুম্বকীয় আবেশ ও পরিবর্তী প্রবাহ',
      slug: 'emi-ac',
      icon: Flame,
      color: 'from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/30',
      descriptionEn: 'Faraday law, transformers, AC RMS/Average values, and LCR series resonance.',
      descriptionBn: 'ফ্যারাডের সূত্র, ট্রান্সফরমার, ac rms মান ও শ্রেণি LCR অনুনাদ।',
      simType: 'AC_CIRCUITS_TRANSFORMER',
    },
    {
      titleEn: 'Unit 5: Electromagnetic Waves',
      titleBn: 'অধ্যায় ৫: তড়িৎচুম্বকীয় তরঙ্গ',
      slug: 'em-waves',
      icon: Sparkles,
      color: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30',
      descriptionEn: 'Orthogonal E and B fields, wave propagation, medium speed, and spectrum.',
      descriptionBn: 'লম্ব E ও B ক্ষেত্র, তড়িৎচুম্বকীয় তরঙ্গের বেগ ও বর্ণালী।',
      simType: 'EM_WAVES_SPECTRUM',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-cyan-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-7">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold text-amber-300">
              Class 12 Physics (1st Semester) • 100% Free & Open
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            A Place Where Students Can{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400">
              SEE & UNDERSTAND
            </span>{' '}
            Physics
          </h1>

          {/* Subtitle with bilingual emphasis */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From <strong className="text-white">JB Physics YouTube MCQs</strong> to interactive practice, step-by-step solutions, and live 3D simulations in{' '}
            <span className="text-amber-300 font-bengali font-bold">বাংলা</span> and{' '}
            <span className="text-cyan-300 font-bold">English</span>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <Link
              href="/learn/class-12/semester-1/physics"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Start Class 12 MCQ Practice</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/qod"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-200 hover:text-white border border-slate-700 font-bold text-sm sm:text-base transition-all flex items-center gap-2 shadow-lg"
            >
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Daily Challenge (QOD)</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free (No Paywall)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-amber-400" />
              <span>Bilingual (English + বাংলা)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Interactive 3D Visualizer</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. LIVE INTERACTIVE SIMULATION SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs uppercase">
                  Featured Live Simulation
                </span>
                <span className="text-xs text-slate-400 font-mono">Q1 Preview</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Electric Flux & Area Normal in 3D Space
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-bengali">
                ত্রিমাত্রিক স্থানে তল ও তড়িৎক্ষেত্রের ফ্লাক্স গণনা (ক্লিক ও ড্র্যাগ করে ঘুরিয়ে দেখুন)
              </p>
            </div>

            <Link
              href="/learn/class-12/semester-1/physics/electrostatics/practice"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <span>Practice Full Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mount Electric Flux 3D Simulator */}
          <SimulationContainer
            type="ELECTRIC_FLUX_3D"
            params={{ fieldVector: [3, -4, 2], plane: 'YZ', side: 2 }}
            title="Electric Flux Simulator (Φ = E · A)"
            initialExpanded={true}
          />
        </div>
      </section>

      {/* 3. CLASS 12 CHAPTER NAVIGATION GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Curriculum Navigation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Class 12 Physics (1st Semester)
            </h2>
            <p className="text-sm text-slate-400 font-bengali">
              অধ্যায়ভিত্তিক এমসিকিউ অনুশীলন, বিশদ সমাধান ও মক টেস্ট
            </p>
          </div>

          <Link
            href="/learn/class-12/semester-1/physics"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View Complete Syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chapters.map((ch) => {
            const Icon = ch.icon;
            return (
              <div
                key={ch.slug}
                className="group rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-amber-500/5 backdrop-blur-sm"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${ch.color} flex items-center justify-center shadow-lg border`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {ch.titleEn}
                    </h3>
                    <p className="text-xs text-amber-300/90 font-bengali font-semibold mt-0.5">
                      {ch.titleBn}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ch.descriptionEn}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <Link
                    href={`/learn/class-12/semester-1/physics/${ch.slug}/practice`}
                    className="flex-1 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs rounded-xl text-center shadow-md transition"
                  >
                    MCQ Practice
                  </Link>

                  <Link
                    href={`/learn/class-12/semester-1/physics/${ch.slug}/test`}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl text-center border border-slate-700 transition"
                  >
                    Timed Test
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW THE LEARNING JOURNEY WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Pedagogy & Design
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How JB Physics Helps You Master Concepts
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A structured scientific loop engineered for board exams and competitive success:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-white">Watch YouTube Video</h4>
              <p className="text-xs text-slate-400">
                Watch conceptual MCQ breakdowns and PYQ series on the JB Physics channel.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-white">Interactive Practice</h4>
              <p className="text-xs text-slate-400">
                Solve questions bilingually in Bengali or English with instant feedback and LaTeX formulas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-white">Simulate & Visualize</h4>
              <p className="text-xs text-slate-400">
                Interact with 3D fields, dielectric slabs, and trajectories to build physical intuition.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h4 className="font-bold text-sm text-white">Practice My Mistakes</h4>
              <p className="text-xs text-slate-400">
                Smart adaptive review sets automatically reinforce questions you previously answered incorrectly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. YOUTUBE & COMMUNITY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900 to-sky-950/40 border border-red-900/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-bold">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Official YouTube Channel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Subscribe to JB Physics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Get new Class 12 1st Semester MCQ video walkthroughs, animation breakdowns, and exam tips every week.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.youtube.com/@jbphysics"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-xl shadow-red-600/30 transition flex items-center gap-2"
            >
              <Youtube className="w-5 h-5" />
              <span>Subscribe on YouTube</span>
            </a>

            <a
              href="https://t.me/jbphysics"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold text-sm rounded-2xl border border-slate-700 transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Telegram Group</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
