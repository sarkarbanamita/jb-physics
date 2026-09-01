'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, ChevronLeft, BookOpen, Trash2 } from 'lucide-react';
import QuestionCard, { QuestionData } from '@/components/mcq/QuestionCard';

export default function BookmarksPage() {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/student/bookmarks');
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
    fetchBookmarks();
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
            <Bookmark className="w-5 h-5 text-amber-400" />
            <span>Bookmarked Questions (সংরক্ষিত প্রশ্ন)</span>
          </h1>
          <p className="text-xs text-slate-400 font-bengali">
            পুনরায় দেখার জন্য আপনার সংরক্ষিত গুরুত্বপূর্ণ প্রশ্নাবলি
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-xl">
          {questions.length} Saved Questions
        </span>
      </div>

      {loading ? (
        <div className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />
      ) : questions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">No Bookmarks Saved Yet</h3>
            <p className="text-xs text-slate-400 font-bengali mt-1">
              অনুশীলনের সময় যে-কোনো কঠিন প্রশ্নে বুকমার্ক আইকনে ক্লিক করে সংরক্ষণ করুন।
            </p>
          </div>
          <Link
            href="/learn/class-12/semester-1/physics"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
          >
            <BookOpen className="w-4 h-4" />
            <span>Start Practicing</span>
          </Link>
        </div>
      ) : (
        <QuestionCard
          question={currentQ}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          onNext={currentIndex < questions.length - 1 ? () => setCurrentIndex(currentIndex + 1) : undefined}
          onPrev={currentIndex > 0 ? () => setCurrentIndex(currentIndex - 1) : undefined}
          mode="PRACTICE"
        />
      )}

    </div>
  );
}
