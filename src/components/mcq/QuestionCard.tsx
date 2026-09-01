'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Send, Sparkles, HelpCircle, Check, X } from 'lucide-react';
import BilingualText from '../ui/BilingualText';
import OptionButton from './OptionButton';
import ExplanationBox from './ExplanationBox';
import confetti from 'canvas-confetti';

export interface QuestionData {
  id: string;
  code: string;
  difficulty: string;
  questionEn: string;
  questionBn: string;
  optionA_En: string;
  optionA_Bn: string;
  optionB_En: string;
  optionB_Bn: string;
  optionC_En: string;
  optionC_Bn: string;
  optionD_En: string;
  optionD_Bn: string;
  correctOption?: string;
  explanationEn?: string;
  explanationBn?: string;
  formula?: string | null;
  youtubeUrl?: string | null;
  youtubeTimestamp?: number | null;
  simulationType?: string | null;
  simulationParams?: any;
  chapter?: {
    titleEn: string;
    titleBn: string;
    slug: string;
  };
  isBookmarked?: boolean;
}

interface QuestionCardProps {
  question: QuestionData;
  questionIndex?: number;
  totalQuestions?: number;
  onNext?: () => void;
  onPrev?: () => void;
  mode?: 'PRACTICE' | 'TEST' | 'MISTAKE' | 'QOD';
  selectedOption?: string | null;
  onSelectOption?: (option: 'A' | 'B' | 'C' | 'D') => void;
  isTestSubmitted?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  onNext,
  onPrev,
  mode = 'PRACTICE',
  selectedOption: externalSelected,
  onSelectOption: externalOnSelect,
  isTestSubmitted = false,
}) => {
  // Local state for Practice / QOD / Mistake modes
  const [internalSelected, setInternalSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctOption, setCorrectOption] = useState<string | null>(question.correctOption || null);
  const [explanationEn, setExplanationEn] = useState<string | null>(question.explanationEn || null);
  const [explanationBn, setExplanationBn] = useState<string | null>(question.explanationBn || null);
  const [isBookmarked, setIsBookmarked] = useState(question.isBookmarked ?? false);

  const isTestMode = mode === 'TEST';
  const currentSelected = isTestMode ? (externalSelected as any) : internalSelected;

  // Reset state when question changes
  useEffect(() => {
    if (!isTestMode) {
      setInternalSelected(null);
      setSubmitted(false);
      setIsCorrect(null);
      setCorrectOption(question.correctOption || null);
      setExplanationEn(question.explanationEn || null);
      setExplanationBn(question.explanationBn || null);
      setIsBookmarked(question.isBookmarked ?? false);
    }
  }, [question.id, isTestMode, question.isBookmarked, question.correctOption, question.explanationEn, question.explanationBn]);

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (isTestMode) {
      if (externalOnSelect && !isTestSubmitted) externalOnSelect(opt);
      return;
    }
    if (submitted) return;
    setInternalSelected(opt);
  };

  const handleSubmitAnswer = async () => {
    if (!currentSelected || submitted || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/questions/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          selectedOption: currentSelected,
          mode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCorrect(data.isCorrect);
        setCorrectOption(data.correctOption);
        setExplanationEn(data.explanationEn);
        setExplanationBn(data.explanationBn);
        setSubmitted(true);

        if (data.isCorrect) {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
          });
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBookmark = async () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      await fetch('/api/questions/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          bookmarked: nextState,
        }),
      });
    } catch (err) {
      setIsBookmarked(!nextState);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff?.toUpperCase()) {
      case 'EASY':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'HARD':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-sm space-y-6">
      
      {/* Question Header Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          {questionIndex !== undefined && (
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-xs flex items-center justify-center border border-amber-500/30">
              Q{questionIndex + 1}
            </span>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-300">
                {question.code}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getDifficultyBadge(question.difficulty)}`}>
                {question.difficulty || 'Medium'}
              </span>
              {question.simulationType && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  <Sparkles className="w-3 h-3" />
                  <span>3D Sim</span>
                </span>
              )}
            </div>
            {question.chapter && (
              <span className="text-[11px] text-slate-400">
                {question.chapter.titleEn}
              </span>
            )}
          </div>
        </div>

        {/* Bookmark & Counter */}
        <div className="flex items-center gap-2">
          {totalQuestions && questionIndex !== undefined && (
            <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
              {questionIndex + 1} / {totalQuestions}
            </span>
          )}
          {!isTestMode && (
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Question Statement */}
      <div className="text-sm sm:text-base font-medium text-slate-100">
        <BilingualText
          en={question.questionEn}
          bn={question.questionBn}
          layout="stacked"
          bnClassName="text-base sm:text-lg font-bold text-amber-200/95"
          enClassName="text-sm sm:text-base text-slate-200"
        />
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <OptionButton
          label="A"
          optionEn={question.optionA_En}
          optionBn={question.optionA_Bn}
          selected={currentSelected === 'A'}
          submitted={isTestMode ? isTestSubmitted : submitted}
          isCorrect={correctOption === 'A'}
          isUserSelection={currentSelected === 'A'}
          disabled={!isTestMode && submitted}
          onClick={() => handleSelectOption('A')}
        />
        <OptionButton
          label="B"
          optionEn={question.optionB_En}
          optionBn={question.optionB_Bn}
          selected={currentSelected === 'B'}
          submitted={isTestMode ? isTestSubmitted : submitted}
          isCorrect={correctOption === 'B'}
          isUserSelection={currentSelected === 'B'}
          disabled={!isTestMode && submitted}
          onClick={() => handleSelectOption('B')}
        />
        <OptionButton
          label="C"
          optionEn={question.optionC_En}
          optionBn={question.optionC_Bn}
          selected={currentSelected === 'C'}
          submitted={isTestMode ? isTestSubmitted : submitted}
          isCorrect={correctOption === 'C'}
          isUserSelection={currentSelected === 'C'}
          disabled={!isTestMode && submitted}
          onClick={() => handleSelectOption('C')}
        />
        <OptionButton
          label="D"
          optionEn={question.optionD_En}
          optionBn={question.optionD_Bn}
          selected={currentSelected === 'D'}
          submitted={isTestMode ? isTestSubmitted : submitted}
          isCorrect={correctOption === 'D'}
          isUserSelection={currentSelected === 'D'}
          disabled={!isTestMode && submitted}
          onClick={() => handleSelectOption('D')}
        />
      </div>

      {/* Submit Button for Practice Mode */}
      {!isTestMode && !submitted && (
        <div className="pt-2">
          <button
            onClick={handleSubmitAnswer}
            disabled={!currentSelected || isSubmitting}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              currentSelected && !isSubmitting
                ? 'bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 shadow-amber-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Checking Solution...' : 'Submit Answer (উত্তর জমা দিন)'}</span>
          </button>
        </div>
      )}

      {/* Answer Feedback Banner in Practice Mode */}
      {!isTestMode && submitted && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 animate-in zoom-in-95 duration-200 ${
            isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/40 border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg ${
                isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
              }`}
            >
              {isCorrect ? <Check className="w-5 h-5 stroke-[3]" /> : <X className="w-5 h-5 stroke-[3]" />}
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base">
                {isCorrect ? 'Excellent! Correct Answer 🎉' : 'Incorrect Attempt ❌'}
              </div>
              <div className="text-xs opacity-80 font-bengali">
                {isCorrect ? 'চমৎকার! আপনার উত্তর সঠিক হয়েছে।' : `সঠিক উত্তর ছিল Option (${correctOption})`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step-by-Step Solution & Simulations & Video */}
      {((!isTestMode && submitted) || (isTestMode && isTestSubmitted)) && correctOption && (
        <ExplanationBox
          correctOption={correctOption}
          explanationEn={explanationEn || question.explanationEn || ''}
          explanationBn={explanationBn || question.explanationBn || ''}
          formula={question.formula}
          youtubeUrl={question.youtubeUrl}
          youtubeTimestamp={question.youtubeTimestamp}
          simulationType={question.simulationType}
          simulationParams={question.simulationParams}
        />
      )}

      {/* Bottom Navigation (Next / Previous) */}
      {(onNext || onPrev) && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <button
            onClick={onPrev}
            disabled={!onPrev}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border transition ${
              onPrev
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={onNext}
            disabled={!onNext}
            className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl border transition ${
              onNext
                ? 'bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
