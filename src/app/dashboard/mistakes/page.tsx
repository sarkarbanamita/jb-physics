'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, ChevronLeft, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import QuestionCard, { QuestionData } from '@/components/mcq/QuestionCard';

export default function MistakesPracticePage() {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchMistakes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/mistakes');
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMistakes();
  }, []);

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-xs text-slate-400 hover:text-amber-400 transition flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-red-400" />
            <span>Practice My Mistakes (ভুল সংশোধন)</span>
          </h1>
          <p className="text-xs text-slate-400 font-bengali">
            পূর্বে ভুল করা প্রশ্নগুলি পুনরায় সমাধান করে ধারণা মজবুত করুন
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 bg-red-950/40 text-red-300 border border-red-500/30 rounded-xl">
          {questions.length} Questions to Review
        </span>
      </div>

      {loading ? (
        <div className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />
      ) : questions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Pending Mistakes! 🎉</h3>
            <p className="text-xs text-slate-400 font-bengali mt-1">
              চমৎকার! আপনার কোনো অমীমাংসিত ভুল প্রশ্ন নেই। নতুন অধ্যায়ের প্রশ্ন অনুশীলন করুন।
            </p>
          </div>
          <Link
            href="/learn/class-12/semester-1/physics"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore MCQ Practice</span>
          </Link>
        </div>
      ) : (
        <QuestionCard
          question={currentQ}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          onNext={currentIndex < questions.length - 1 ? () => setCurrentIndex(currentIndex + 1) : undefined}
          onPrev={currentIndex > 0 ? () => setCurrentIndex(currentIndex - 1) : undefined}
          mode="MISTAKE"
        />
      )}

    </div>
  );
}
