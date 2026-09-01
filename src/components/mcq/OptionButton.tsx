'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../ui/LangContext';
import MathRenderer from '../ui/MathRenderer';

interface OptionButtonProps {
  label: 'A' | 'B' | 'C' | 'D';
  optionEn: string;
  optionBn: string;
  selected: boolean;
  submitted: boolean;
  isCorrect?: boolean;
  isUserSelection?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  optionEn,
  optionBn,
  selected,
  submitted,
  isCorrect,
  isUserSelection,
  disabled = false,
  onClick,
}) => {
  const { lang } = useLanguage();

  // Determine state styling
  let containerStyle = 'border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200';
  let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';

  if (!submitted) {
    if (selected) {
      containerStyle = 'border-amber-500 bg-amber-500/10 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50';
      badgeStyle = 'bg-amber-500 text-slate-950 font-bold border-amber-400';
    }
  } else {
    // Submitted state
    if (isCorrect) {
      containerStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-100 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500';
      badgeStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400';
    } else if (isUserSelection && !isCorrect) {
      containerStyle = 'border-red-500 bg-red-950/30 text-red-100 shadow-lg shadow-red-500/20 ring-2 ring-red-500';
      badgeStyle = 'bg-red-500 text-white font-bold border-red-400';
    } else {
      containerStyle = 'border-slate-800/60 bg-slate-950/40 text-slate-500 opacity-60';
      badgeStyle = 'bg-slate-900 text-slate-500 border-slate-800';
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-start gap-3.5 ${containerStyle} ${
        disabled && !submitted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
    >
      {/* Option Key Badge (A, B, C, D) */}
      <div
        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold border transition-colors ${badgeStyle}`}
      >
        {submitted && isCorrect ? (
          <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
        ) : submitted && isUserSelection && !isCorrect ? (
          <X className="w-4 h-4 text-white stroke-[3]" />
        ) : (
          label
        )}
      </div>

      {/* Option Text Content */}
      <div className="flex-1 min-w-0 pt-0.5 text-xs sm:text-sm">
        {lang === 'bn' ? (
          <div className="font-bengali">
            <MathRenderer content={optionBn} />
          </div>
        ) : lang === 'en' ? (
          <div>
            <MathRenderer content={optionEn} />
          </div>
        ) : (
          // Dual View
          <div className="space-y-1">
            <div className="font-bengali text-slate-100">
              <MathRenderer content={optionBn} />
            </div>
            {optionEn !== optionBn && (
              <div className="text-slate-400 text-xs">
                <MathRenderer content={optionEn} />
              </div>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default OptionButton;
