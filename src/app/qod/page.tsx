'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Users, Sparkles, Share2, ArrowRight } from 'lucide-react';
import QuestionCard, { QuestionData } from '@/components/mcq/QuestionCard';

export default function QuestionOfTheDayPage() {
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [communityStats, setCommunityStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/questions/qod')
      .then((res) => res.json())
      .then((data) => {
        if (data.question) {
          setQuestion(data.question);
          setCommunityStats(data.communityStats);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'JB Physics — Question of the Day',
        text: 'Can you solve today\'s physics challenge on JB Physics?',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-red-950/30 border border-amber-500/30 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Daily Physics Challenge</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Question of the Day
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-bengali">
            আজকের বিশেষ পদার্থবিদ্যা প্রশ্ন। সমাধান করুন এবং দেখুন অন্যান্য শিক্ষার্থীদের তুলনায় আপনার নির্ভুলতা কত!
          </p>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 shadow-md"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <span>{copied ? 'Link Copied!' : 'Share Challenge'}</span>
        </button>
      </div>

      {/* Community Stats HUD */}
      {communityStats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Total Attempts</div>
              <div className="text-base font-extrabold text-white font-mono">
                {communityStats.totalAttempts || 48} Solvers
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Community Accuracy</div>
              <div className="text-base font-extrabold text-emerald-400 font-mono">
                {communityStats.accuracyPercent || 72}%
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Next Question</div>
              <div className="text-xs font-bold text-slate-300">
                Resets at Midnight
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Card */}
      {loading ? (
        <div className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />
      ) : question ? (
        <QuestionCard question={question} mode="QOD" />
      ) : (
        <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">No Question of the Day active.</p>
        </div>
      )}

    </div>
  );
}
