'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Search,
  RotateCcw,
} from 'lucide-react';
import QuestionCard, { QuestionData } from '@/components/mcq/QuestionCard';

export default function ChapterPracticePage() {
  const params = useParams();
  const chapterSlug = params.chapterSlug as string;

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [chapterTitle, setChapterTitle] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let url = `/api/questions?chapterSlug=${chapterSlug}&limit=50`;
      if (difficultyFilter !== 'ALL') url += `&difficulty=${difficultyFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        if (data.questions[0]?.chapter) {
          setChapterTitle(data.questions[0].chapter.titleEn);
        }
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [chapterSlug, difficultyFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/learn/class-12/semester-1/physics" className="hover:text-amber-400 transition flex items-center gap-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Class 12 Semester 1</span>
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-semibold capitalize">
              {chapterSlug.replace('-', ' ')}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            {chapterTitle || 'Interactive MCQ Practice'}
          </h1>
        </div>

        {/* Quick Chapter Links */}
        <div className="flex items-center gap-2">
          <Link
            href={`/learn/class-12/semester-1/physics/${chapterSlug}/simulations`}
            className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Simulations</span>
          </Link>

          <Link
            href={`/learn/class-12/semester-1/physics/${chapterSlug}/test`}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mock Test</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        
        {/* Difficulty Pill Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Difficulty:</span>
          {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                difficultyFilter === diff
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formula, terms..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            Find
          </button>
        </form>

      </div>

      {/* Question Area */}
      {loading ? (
        <div className="h-96 rounded-3xl bg-slate-900/50 border border-slate-800 animate-pulse" />
      ) : questions.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No questions found matching criteria</h3>
          <p className="text-xs text-slate-400">
            Try switching difficulty filters or clearing search query.
          </p>
          <button
            onClick={() => {
              setDifficultyFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-800 text-amber-400 text-xs font-bold rounded-xl border border-slate-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <QuestionCard
          question={currentQuestion}
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
