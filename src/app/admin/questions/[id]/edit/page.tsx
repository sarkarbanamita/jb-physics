'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Save,
  Eye,
  CheckCircle2,
  FunctionSquare,
  Sparkles,
  Youtube,
} from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';
import BilingualText from '@/components/ui/BilingualText';

export default function EditQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const questionId = params.id as string;

  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [chapterId, setChapterId] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [questionEn, setQuestionEn] = useState('');
  const [questionBn, setQuestionBn] = useState('');
  const [optionA_En, setOptionA_En] = useState('');
  const [optionA_Bn, setOptionA_Bn] = useState('');
  const [optionB_En, setOptionB_En] = useState('');
  const [optionB_Bn, setOptionB_Bn] = useState('');
  const [optionC_En, setOptionC_En] = useState('');
  const [optionC_Bn, setOptionC_Bn] = useState('');
  const [optionD_En, setOptionD_En] = useState('');
  const [optionD_Bn, setOptionD_Bn] = useState('');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [formula, setFormula] = useState('');
  const [explanationEn, setExplanationEn] = useState('');
  const [explanationBn, setExplanationBn] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeTimestamp, setYoutubeTimestamp] = useState(0);
  const [simulationType, setSimulationType] = useState('');
  const [simulationParams, setSimulationParams] = useState('{}');
  const [isPublished, setIsPublished] = useState(true);
  const [isQuestionOfDay, setIsQuestionOfDay] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/chapters').then((r) => r.json()),
      fetch(`/api/admin/questions/${questionId}`).then((r) => r.json()),
    ])
      .then(([cData, qData]) => {
        if (cData.chapters) setChapters(cData.chapters);
        if (qData.question) {
          const q = qData.question;
          setCode(q.code);
          setChapterId(q.chapterId);
          setDifficulty(q.difficulty);
          setQuestionEn(q.questionEn);
          setQuestionBn(q.questionBn);
          setOptionA_En(q.optionA_En);
          setOptionA_Bn(q.optionA_Bn);
          setOptionB_En(q.optionB_En);
          setOptionB_Bn(q.optionB_Bn);
          setOptionC_En(q.optionC_En);
          setOptionC_Bn(q.optionC_Bn);
          setOptionD_En(q.optionD_En);
          setOptionD_Bn(q.optionD_Bn);
          setCorrectOption(q.correctOption as any);
          setFormula(q.formula || '');
          setExplanationEn(q.explanationEn || '');
          setExplanationBn(q.explanationBn || '');
          setYoutubeUrl(q.youtubeUrl || '');
          setYoutubeTimestamp(q.youtubeTimestamp || 0);
          setSimulationType(q.simulationType || '');
          setSimulationParams(q.simulationParams || '{}');
          setIsPublished(q.isPublished);
          setIsQuestionOfDay(q.isQuestionOfDay);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [questionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          chapterId,
          difficulty,
          questionEn,
          questionBn,
          optionA_En,
          optionA_Bn,
          optionB_En,
          optionB_Bn,
          optionC_En,
          optionC_Bn,
          optionD_En,
          optionD_Bn,
          correctOption,
          formula,
          explanationEn,
          explanationBn,
          youtubeUrl,
          youtubeTimestamp,
          simulationType: simulationType || null,
          simulationParams,
          isPublished,
          isQuestionOfDay,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update question');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/questions');
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading question details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link href="/admin/questions" className="text-xs text-slate-400 hover:text-amber-400 transition flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Question Bank</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Edit Question: <span className="font-mono text-amber-400">{code}</span>
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Question updated successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Classification */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            1. Classification
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Question Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Chapter</label>
              <select
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.titleEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statements */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            2. Statements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-amber-300 font-bold font-bengali">বাংলা প্রশ্ন</label>
              <textarea
                required
                rows={4}
                value={questionBn}
                onChange={(e) => setQuestionBn(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bengali text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-cyan-300 font-bold">English Question</label>
              <textarea
                required
                rows={4}
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              3. Options & Correct Answer
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-bold">Correct Key:</span>
              {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setCorrectOption(opt)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                    correctOption === opt
                      ? 'bg-emerald-500 text-slate-950 font-extrabold ring-2 ring-emerald-400'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="font-bold text-amber-400">Option (A)</div>
              <input
                type="text"
                value={optionA_En}
                onChange={(e) => setOptionA_En(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
              <input
                type="text"
                value={optionA_Bn}
                onChange={(e) => setOptionA_Bn(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-bengali"
              />
            </div>

            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="font-bold text-amber-400">Option (B)</div>
              <input
                type="text"
                value={optionB_En}
                onChange={(e) => setOptionB_En(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
              <input
                type="text"
                value={optionB_Bn}
                onChange={(e) => setOptionB_Bn(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-bengali"
              />
            </div>

            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="font-bold text-amber-400">Option (C)</div>
              <input
                type="text"
                value={optionC_En}
                onChange={(e) => setOptionC_En(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
              <input
                type="text"
                value={optionC_Bn}
                onChange={(e) => setOptionC_Bn(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-bengali"
              />
            </div>

            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="font-bold text-amber-400">Option (D)</div>
              <input
                type="text"
                value={optionD_En}
                onChange={(e) => setOptionD_En(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
              <input
                type="text"
                value={optionD_Bn}
                onChange={(e) => setOptionD_Bn(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-bengali"
              />
            </div>
          </div>
        </div>

        {/* Formula & Explanation */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            4. Formula & Explanation
          </h2>
          <div className="space-y-1 text-xs">
            <label className="text-slate-300 font-semibold">Formula</label>
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-amber-300 font-bold font-bengali">বিশদ সমাধান</label>
              <textarea
                rows={5}
                value={explanationBn}
                onChange={(e) => setExplanationBn(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bengali text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-cyan-300 font-bold">English Solution</label>
              <textarea
                rows={5}
                value={explanationEn}
                onChange={(e) => setExplanationEn(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Simulations & Video */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            5. Simulation & YouTube Integration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Simulation Type</label>
              <select
                value={simulationType}
                onChange={(e) => setSimulationType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="">None</option>
                <option value="ELECTRIC_FLUX_3D">3D Electric Flux Visualizer</option>
                <option value="CAPACITOR_DIELECTRIC">Capacitor & Dielectric Medium</option>
                <option value="PROJECTILE_MOTION">Projectile Motion Trajectory</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Parameters JSON</label>
              <input
                type="text"
                value={simulationParams}
                onChange={(e) => setSimulationParams(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">YouTube URL</label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Timestamp (seconds)</label>
              <input
                type="number"
                value={youtubeTimestamp}
                onChange={(e) => setYoutubeTimestamp(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
