'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Atom, Zap, Compass, Sparkles, BookOpen, CheckCircle2, ArrowRight, PlaySquare, Layers, Award } from 'lucide-react';
import { useLanguage } from '@/components/ui/LangContext';

interface ChapterItem {
  id: string;
  titleEn: string;
  titleBn: string;
  slug: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  topicsCount: number;
  questionsCount: number;
  testsCount: number;
  userProgress: { solved: number; correct: number };
}

export default function Class12PhysicsPage() {
  const { lang } = useLanguage();
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/chapters')
      .then((res) => res.json())
      .then((data) => {
        if (data.chapters) setChapters(data.chapters);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return Zap;
      case 'Compass':
        return Compass;
      default:
        return Atom;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
            <span>Class 12 • 1st Semester</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Class 12 Physics (Semester I)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-bengali leading-relaxed">
            দ্বাদশ শ্রেণি পদার্থবিদ্যা — প্রথম সেমিস্টার। অধ্যায়ভিত্তিক ধারণা, দ্বৈত ভাষার এমসিকিউ অনুশীলন, বিশদ সমাধান ও সিমুলেশন।
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>3 Core Units</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Interactive Simulations</span>
            </span>
            <span className="flex items-center gap-1.5">
              <PlaySquare className="w-4 h-4 text-red-400" />
              <span>YouTube Video Solutions</span>
            </span>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Chapter Units (অধ্যায়সমূহ)</span>
          </h2>
          <span className="text-xs text-slate-400">
            {chapters.length} Chapters Available
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chapters.map((ch, idx) => {
              const Icon = getChapterIcon(ch.icon);
              const progressPct = ch.questionsCount > 0
                ? Math.min(100, Math.round((ch.userProgress.solved / ch.questionsCount) * 100))
                : 0;

              return (
                <div
                  key={ch.id}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition duration-300 p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm group"
                >
                  <div className="space-y-4">
                    {/* Header with Icon & Index */}
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        UNIT 0{idx + 1}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        {ch.titleEn}
                      </h3>
                      <p className="text-xs text-amber-300/90 font-bengali font-semibold mt-0.5">
                        {ch.titleBn}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lang === 'bn' ? ch.descriptionBn : ch.descriptionEn}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-amber-400 font-mono font-bold">{progressPct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-6 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                    <Link
                      href={`/learn/class-12/semester-1/physics/${ch.slug}/practice`}
                      className="py-2.5 px-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs rounded-xl text-center shadow-md transition flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Practice</span>
                    </Link>

                    <Link
                      href={`/learn/class-12/semester-1/physics/${ch.slug}/test`}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl text-center border border-slate-700 transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Mock Test</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
