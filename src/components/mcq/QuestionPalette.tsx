'use client';

import React from 'react';
import { Bookmark, CheckCircle2, Circle } from 'lucide-react';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<number, string>;
  markedForReview: Record<number, boolean>;
  onSelectIndex: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentIndex,
  answers,
  markedForReview,
  onSelectIndex,
}) => {
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const unattemptedCount = totalQuestions - answeredCount;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Question Palette (প্রশ্ন তালিকা)
        </h3>
        <span className="text-[11px] font-mono text-amber-400">
          {answeredCount}/{totalQuestions} Answered
        </span>
      </div>

      {/* Status Legends */}
      <div className="grid grid-cols-3 gap-2 text-[10px]">
        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded-lg border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-400 bg-purple-950/30 px-2 py-1 rounded-lg border border-purple-500/20">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span>Review ({markedCount})</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-slate-600" />
          <span>Pending ({unattemptedCount})</span>
        </div>
      </div>

      {/* Palette Number Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-1">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isAnswered = !!answers[i];
          const isMarked = !!markedForReview[i];
          const isActive = currentIndex === i;

          let btnStyle = 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700';

          if (isAnswered && isMarked) {
            btnStyle = 'bg-purple-950/60 text-purple-300 border-purple-500 font-bold';
          } else if (isAnswered) {
            btnStyle = 'bg-emerald-950/60 text-emerald-300 border-emerald-500 font-bold';
          } else if (isMarked) {
            btnStyle = 'bg-purple-950/40 text-purple-400 border-purple-500/50';
          }

          if (isActive) {
            btnStyle += ' ring-2 ring-amber-400 border-amber-400 text-white font-extrabold';
          }

          return (
            <button
              key={i}
              onClick={() => onSelectIndex(i)}
              className={`h-10 rounded-xl border text-xs font-mono transition flex flex-col items-center justify-center relative ${btnStyle}`}
            >
              <span>{i + 1}</span>
              {isMarked && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPalette;
