'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  CheckCircle2,
  Flame,
  LayoutDashboard,
  RotateCcw,
  Bookmark,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  Layers,
  XCircle,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/stats')
      .then((res) => {
        if (res.status === 401) {
          router.push('/auth/login');
          return null;
        }
        return res.json();
      })
      .then((resData) => {
        if (resData) setData(resData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading your physics dashboard...</p>
      </div>
    );
  }

  const { user, stats, chapterProgress, recentAttempts } = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              Student Hub
            </span>
            <span className="text-xs text-slate-400">Class 12 Physics (Semester I)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name || 'Physicist'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-bengali">
            আপনার শিখন অগ্রগতি, নির্ভুলতার হার এবং পূর্ববর্তী প্রশ্নাবলি পর্যালোচনা করুন।
          </p>
        </div>

        {/* Daily Streak Badge */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Flame className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Daily Streak</div>
            <div className="text-lg font-extrabold text-amber-400 font-mono">
              {stats?.streakDays || 0} Days Active 🔥
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Questions Solved</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats?.totalSolved || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">মোট সমাধান করা প্রশ্ন</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Correct Answers</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {stats?.totalCorrect || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">সঠিক উত্তর সংখ্যা</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Overall Accuracy</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {stats?.accuracyPercent || 0}%
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">সামগ্রিক নির্ভুলতা</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Mistakes to Review</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">
            {stats?.mistakesCount || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">ভুল সংশোধনের সুযোগ</div>
        </div>

      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Link
          href="/dashboard/mistakes"
          className="p-5 rounded-2xl bg-gradient-to-br from-red-950/20 via-slate-900 to-slate-900 border border-red-900/30 hover:border-red-500/50 transition group space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="font-bold text-white text-base">Practice My Mistakes</h3>
          <p className="text-xs text-slate-400 font-bengali">
            পূর্বে ভুল করা {stats?.mistakesCount || 0} টি প্রশ্ন পুনরায় অনুশীলন করুন
          </p>
        </Link>

        <Link
          href="/dashboard/bookmarks"
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 border border-amber-900/30 hover:border-amber-500/50 transition group space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="font-bold text-white text-base">Bookmarked Questions</h3>
          <p className="text-xs text-slate-400 font-bengali">
            সংরক্ষিত {stats?.bookmarksCount || 0} টি গুরুত্বপূর্ণ প্রশ্ন
          </p>
        </Link>

        <Link
          href="/learn/class-12/semester-1/physics"
          className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-slate-900 to-slate-900 border border-cyan-900/30 hover:border-cyan-500/50 transition group space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="font-bold text-white text-base">Chapter MCQ Sets</h3>
          <p className="text-xs text-slate-400 font-bengali">
            অধ্যায়ভিত্তিক নতুন প্রশ্ন ও সিমুলেশন অনুশীলন
          </p>
        </Link>

      </div>

      {/* Chapter Progress Bars */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Chapter Progress (অধ্যায়ভিত্তিক অগ্রগতি)</span>
          </h2>
        </div>

        <div className="space-y-4">
          {chapterProgress?.map((ch: any) => (
            <div key={ch.id} className="space-y-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-white">{ch.titleEn}</span>
                  <span className="text-slate-400 font-bengali ml-2">({ch.titleBn})</span>
                </div>
                <div className="font-mono text-slate-300">
                  <span className="text-amber-400 font-bold">{ch.solvedQuestions}</span> / {ch.totalQuestions} Solved ({ch.progressPercent}%)
                </div>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${ch.progressPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
