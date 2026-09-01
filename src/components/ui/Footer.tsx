'use client';

import React from 'react';
import Link from 'next/link';
import { Atom, Youtube, Send, MessageCircle, Heart, Sparkles, Shield, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Atom className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                JB PHYSICS
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering students with <strong className="text-white">100% free</strong> interactive physics education, bilingual MCQs (English + বাংলা), real-time simulations, and video solutions.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Learn • Solve • Simulate</span>
            </div>
          </div>

          {/* Quick Learning Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Class 12 Semester 1</span>
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/learn/class-12/semester-1/physics/electrostatics/practice" className="hover:text-amber-400 transition">
                  Unit 1: Electrostatics (স্থির তড়িৎ)
                </Link>
              </li>
              <li>
                <Link href="/learn/class-12/semester-1/physics/current-electricity/practice" className="hover:text-amber-400 transition">
                  Unit 2: Current Electricity (প্রবাহী তড়িৎ)
                </Link>
              </li>
              <li>
                <Link href="/learn/class-12/semester-1/physics/magnetism/practice" className="hover:text-amber-400 transition">
                  Unit 3: Magnetic Effects (চৌম্বক ক্রিয়া)
                </Link>
              </li>
              <li>
                <Link href="/learn/class-12/semester-1/physics/electrostatics/simulations" className="hover:text-amber-400 transition">
                  Interactive Physics Simulations
                </Link>
              </li>
              <li>
                <Link href="/qod" className="hover:text-amber-400 transition">
                  🔥 Question of the Day
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Hub */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Practice & Progress</span>
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/learn/class-12/semester-1/physics/electrostatics/test" className="hover:text-cyan-400 transition">
                  Timed Practice Tests
                </Link>
              </li>
              <li>
                <Link href="/dashboard/mistakes" className="hover:text-cyan-400 transition">
                  Practice My Mistakes
                </Link>
              </li>
              <li>
                <Link href="/dashboard/bookmarks" className="hover:text-cyan-400 transition">
                  Bookmarked Questions
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition">
                  Student Analytics & Accuracy
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-cyan-400 transition">
                  Free Student Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Socials */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-xs">
              Join Our Community
            </h4>
            <p className="text-xs text-slate-400">
              Connect with fellow physics students, get daily questions, and watch complete video explanations:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.youtube.com/@jbphysics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 rounded-xl transition font-semibold"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>JB Physics YouTube Channel</span>
              </a>

              <a
                href="https://t.me/jbphysics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl transition font-semibold"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>Telegram Physics Group</span>
              </a>

              <a
                href="https://whatsapp.com/channel/jbphysics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Channel</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & free pledge */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-300">JB Physics</strong>. Dedicated to accessible, high-quality physics education for all students.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for Physics Learners</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
