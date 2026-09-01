'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Save,
  Eye,
  Sparkles,
  Youtube,
  FunctionSquare,
  CheckCircle2,
  Atom,
} from 'lucide-react';
import MathRenderer from '@/components/ui/MathRenderer';
import BilingualText from '@/components/ui/BilingualText';

export default function NewQuestionPage() {
  const router = useRouter();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form states
  const [code, setCode] = useState('WB12-CH01-Q011');
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
    fetch('/api/chapters')
      .then((res) => res.json())
      .then((data) => {
        if (data.chapters && data.chapters.length > 0) {
          setChapters(data.chapters);
          setChapterId(data.chapters[0].id);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
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
        throw new Error(data.error || 'Failed to create question');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/questions');
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            Create New Bilingual MCQ
          </h1>
          <p className="text-xs text-slate-400 font-bengali">
            নতুন এমসিকিউ প্রশ্ন, বাংলা অনুবাদ, ব্যাখ্যা এবং সিমুলেশন কনফিগার করুন
          </p>
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
          <span>Question created successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Metadata */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            1. Question Classification & Metadata
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Question Code / ID</label>
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
                <option value="EASY">Easy (সহজ)</option>
                <option value="MEDIUM">Medium (মধ্যম)</option>
                <option value="HARD">Hard (কঠিন)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Bilingual Question Statements */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            2. Question Statements (LaTeX supported with $..$ and $$..$$)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Bengali Question */}
            <div className="space-y-1.5">
              <label className="text-amber-300 font-bold font-bengali">
                বাংলা প্রশ্ন (Bengali Statement)
              </label>
              <textarea
                required
                rows={4}
                value={questionBn}
                onChange={(e) => setQuestionBn(e.target.value)}
                placeholder="একটি কণাকে 20 m/s প্রাথমিক বেগে উল্লম্বভাবে উপরের দিকে নিক্ষেপ করা হলো..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bengali text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* English Question */}
            <div className="space-y-1.5">
              <label className="text-cyan-300 font-bold">
                English Question (English Statement)
              </label>
              <textarea
                required
                rows={4}
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                placeholder="A particle is projected vertically upward with an initial velocity of $20\text{ m/s}$..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Live KaTeX Statement Preview */}
          {(questionBn || questionEn) && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Live LaTeX & Font Rendering Preview</span>
              </div>
              <BilingualText en={questionEn} bn={questionBn} layout="stacked" />
            </div>
          )}
        </div>

        {/* Section 3: Bilingual Options */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              3. Options (A, B, C, D) & Correct Key
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
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 font-extrabold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Option A */}
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="font-bold text-amber-400">Option (A)</div>
              <input
                type="text"
                placeholder="Option A (English)"
                value={optionA_En}
                onChange={(e) => setOptionA_En(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Option A (বাংলা)"
                value={optionA_Bn}
                onChange={(e) => setOptionA_Bn(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-bengali"
              />
            </div>

            {/* Option B */}
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="font-bold text-amber-400">Option (B)</div>
              <input
                type="text"
                placeholder="Option B (English)"
                value={optionB_En}
                onChange={(e) => setOptionB_En(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Option B (বাংলা)"
                value={optionB_Bn}
                onChange={(e) => setOptionB_Bn(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-bengali"
              />
            </div>

            {/* Option C */}
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="font-bold text-amber-400">Option (C)</div>
              <input
                type="text"
                placeholder="Option C (English)"
                value={optionC_En}
                onChange={(e) => setOptionC_En(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Option C (বাংলা)"
                value={optionC_Bn}
                onChange={(e) => setOptionC_Bn(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-bengali"
              />
            </div>

            {/* Option D */}
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="font-bold text-amber-400">Option (D)</div>
              <input
                type="text"
                placeholder="Option D (English)"
                value={optionD_En}
                onChange={(e) => setOptionD_En(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
              />
              <input
                type="text"
                placeholder="Option D (বাংলা)"
                value={optionD_Bn}
                onChange={(e) => setOptionD_Bn(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-bengali"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Formula & Detailed Solution */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            4. Formula & Step-by-Step Solution
          </h2>

          <div className="space-y-1 text-xs">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <FunctionSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Physics Formula Used (LaTeX)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. \Phi = \vec{E} \cdot \vec{A} or C = \frac{k \varepsilon_0 A}{d}"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-mono text-xs"
            />
            {formula && (
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <MathRenderer content={`$${formula}$`} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-amber-300 font-bold font-bengali">
                বিশদ সমাধান (Bengali Explanation)
              </label>
              <textarea
                rows={5}
                value={explanationBn}
                onChange={(e) => setExplanationBn(e.target.value)}
                placeholder="গাউসের সূত্র প্রয়োগ করে পাই..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-bengali text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-cyan-300 font-bold">
                Detailed Solution (English Explanation)
              </label>
              <textarea
                rows={5}
                value={explanationEn}
                onChange={(e) => setExplanationEn(e.target.value)}
                placeholder="By calculating the dot product..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Simulation & YouTube Integration */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            5. Reusable Simulation & YouTube Video Integration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulation Component</span>
              </label>
              <select
                value={simulationType}
                onChange={(e) => setSimulationType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="">None (No simulation)</option>
                <option value="ELECTRIC_FLUX_3D">3D Electric Flux Visualizer</option>
                <option value="CAPACITOR_DIELECTRIC">Capacitor & Dielectric Medium</option>
                <option value="PROJECTILE_MOTION">Projectile Motion Trajectory</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">
                Simulation Parameters (JSON)
              </label>
              <input
                type="text"
                value={simulationParams}
                onChange={(e) => setSimulationParams(e.target.value)}
                placeholder='{"fieldVector": [3, -4, 2], "plane": "YZ", "side": 2}'
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-cyan-300 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube Video URL</span>
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">
                Timestamp (in seconds)
              </label>
              <input
                type="number"
                value={youtubeTimestamp}
                onChange={(e) => setYoutubeTimestamp(Number(e.target.value))}
                placeholder="45"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Publishing MCQ...' : 'Publish Question'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
