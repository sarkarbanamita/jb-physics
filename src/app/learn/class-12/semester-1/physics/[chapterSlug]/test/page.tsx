'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Timer,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Bookmark,
  Sparkles,
  TrendingUp,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import QuestionCard, { QuestionData } from '@/components/mcq/QuestionCard';
import QuestionPalette from '@/components/mcq/QuestionPalette';
import { formatTime } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface TestResult {
  score: number;
  totalMarks: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  accuracy: number;
  timeSpentSec: number;
  strongTopics: string[];
  weakTopics: string[];
  detailedResults: any[];
}

export default function TimedPracticeTestPage() {
  const params = useParams();
  const router = useRouter();
  const chapterSlug = params.chapterSlug as string;

  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // { questionId: "A" }
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  
  // Timer state
  const [timeLeftSec, setTimeLeftSec] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Submission & Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    fetch(`/api/tests/${chapterSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.test) {
          setTest(data.test);
          setQuestions(data.test.questions);
          setTimeLeftSec((data.test.durationMinutes || 15) * 60);
          setIsTimerRunning(true);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [chapterSlug]);

  // Countdown timer
  useEffect(() => {
    if (!isTimerRunning || testSubmitted) return;

    const interval = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, testSubmitted, answers, test]);

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (testSubmitted) return;
    const currentQ = questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleClearResponse = () => {
    if (testSubmitted) return;
    const currentQ = questions[currentIndex];
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleSubmitTest = async () => {
    if (isSubmitting || testSubmitted || !test) return;
    setIsSubmitting(true);
    setIsTimerRunning(false);

    const initialDuration = (test.durationMinutes || 15) * 60;
    const timeSpent = Math.max(0, initialDuration - timeLeftSec);

    try {
      const res = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId: test.id,
          answers,
          timeSpentSec: timeSpent,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data);
        setTestSubmitted(true);

        if (data.accuracy >= 70) {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Failed to submit test:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
  // Palette answers mapping by index
  const paletteAnswers: Record<number, string> = {};
  questions.forEach((q, idx) => {
    if (answers[q.id]) paletteAnswers[idx] = answers[q.id];
  });

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Preparing Class 12 Practice Test...</p>
      </div>
    );
  }

  // ================= RESULTS SCREEN =================
  if (testSubmitted && result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
        
        {/* Score Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 p-6 sm:p-10 shadow-2xl text-center space-y-5">
          <div className="inline-flex p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Test Completed!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-bengali mt-1">
              মক টেস্ট ফলাফল ও বিস্তারিত মূল্যায়ন রিপোর্ট
            </p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Final Score</div>
              <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                {result.score}/{result.totalMarks}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Accuracy</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                {result.accuracy}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Time Taken</div>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-1">
                {formatTime(result.timeSpentSec)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Correct / Total</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                {result.correctCount}/{result.totalQuestions}
              </div>
            </div>
          </div>

          {/* Strong vs Weak Topics Diagnostics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2 text-left">
            {/* Strong */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Topics (দক্ষ অংশ)</span>
              </div>
              {result.strongTopics.length > 0 ? (
                <ul className="text-xs text-emerald-200 space-y-1">
                  {result.strongTopics.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">Keep practicing to build topic strengths!</p>
              )}
            </div>

            {/* Weak */}
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Needs Review (পুনরাবৃত্তি প্রয়োজন)</span>
              </div>
              {result.weakTopics.length > 0 ? (
                <ul className="text-xs text-red-200 space-y-1">
                  {result.weakTopics.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-300 font-semibold">Outstanding! No weak areas detected 🎉</p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href={`/learn/class-12/semester-1/physics/${chapterSlug}/practice`}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
            >
              Back to Practice Mode
            </Link>

            <Link
              href="/dashboard/mistakes"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              Practice My Mistakes
            </Link>
          </div>
        </div>

        {/* Detailed Solutions Review List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Question-by-Question Solution Review</span>
            </h2>
            <span className="text-xs text-slate-400">
              {result.detailedResults.length} Questions
            </span>
          </div>

          <div className="space-y-6">
            {result.detailedResults.map((item, idx) => (
              <QuestionCard
                key={item.questionId}
                question={item}
                questionIndex={idx}
                totalQuestions={result.detailedResults.length}
                selectedOption={item.selectedOption}
                mode="TEST"
                isTestSubmitted={true}
              />
            ))}
          </div>
        </div>

      </div>
    );
  }

  // ================= ACTIVE TEST SCREEN =================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Test Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl backdrop-blur-md sticky top-20 z-40">
        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <span>{test?.titleEn || 'Class 12 Physics Test'}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase">
              Live Test
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-bengali">
            {test?.titleBn}
          </p>
        </div>

        {/* Live Timer & Submit */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-2 rounded-2xl border font-mono font-bold text-sm sm:text-base flex items-center gap-2 ${
              timeLeftSec < 180
                ? 'bg-red-950/60 border-red-500/50 text-red-400 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-amber-400'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{formatTime(timeLeftSec)}</span>
          </div>

          <button
            onClick={handleSubmitTest}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Test'}</span>
          </button>
        </div>
      </div>

      {/* Main Test Body: Question Card + Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Question Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {currentQ && (
            <QuestionCard
              question={currentQ}
              questionIndex={currentIndex}
              totalQuestions={questions.length}
              mode="TEST"
              selectedOption={answers[currentQ.id] || null}
              onSelectOption={handleSelectOption}
              onNext={currentIndex < questions.length - 1 ? () => setCurrentIndex(currentIndex + 1) : undefined}
              onPrev={currentIndex > 0 ? () => setCurrentIndex(currentIndex - 1) : undefined}
            />
          )}

          {/* Test Action Controls below question */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <button
              onClick={handleToggleReview}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                markedForReview[currentIndex]
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{markedForReview[currentIndex] ? 'Marked for Review' : 'Mark for Review'}</span>
            </button>

            <button
              onClick={handleClearResponse}
              disabled={!answers[currentQ?.id]}
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 rounded-xl text-xs font-semibold transition"
            >
              Clear Response
            </button>
          </div>
        </div>

        {/* Question Palette (1/3 width) */}
        <div className="lg:col-span-1">
          <QuestionPalette
            totalQuestions={questions.length}
            currentIndex={currentIndex}
            answers={paletteAnswers}
            markedForReview={markedForReview}
            onSelectIndex={(idx) => setCurrentIndex(idx)}
          />
        </div>

      </div>

    </div>
  );
}
