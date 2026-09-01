'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Download,
  Copy,
} from 'lucide-react';

export default function BulkUploadPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const sampleQuestions = [
    {
      code: 'WB12-CH01-Q015',
      chapterSlug: 'electrostatics',
      difficulty: 'MEDIUM',
      questionEn: 'Two point charges $+2\\,\\mu\\text{C}$ and $-2\\,\\mu\\text{C}$ are separated by $10\\text{ cm}$. Find the dipole moment.',
      questionBn: '$+2\\,\\mu\\text{C}$ এবং $-2\\,\\mu\\text{C}$ মানের দুটি বিন্দু আধান পরস্পরের থেকে $10\\text{ cm}$ দূরত্বে অবস্থিত। দ্বিমেরু ভ্রামক কত হবে?',
      optionA_En: '$2 \\times 10^{-7}\\text{ C}\\cdot\\text{m}$',
      optionA_Bn: '$2 \\times 10^{-7}\\text{ C}\\cdot\\text{m}$',
      optionB_En: '$4 \\times 10^{-7}\\text{ C}\\cdot\\text{m}$',
      optionB_Bn: '$4 \\times 10^{-7}\\text{ C}\\cdot\\text{m}$',
      optionC_En: '$10^{-7}\\text{ C}\\cdot\\text{m}$',
      optionC_Bn: '$10^{-7}\\text{ C}\\cdot\\text{m}$',
      optionD_En: '$2 \\times 10^{-6}\\text{ C}\\cdot\\text{m}$',
      optionD_Bn: '$2 \\times 10^{-6}\\text{ C}\\cdot\\text{m}$',
      correctOption: 'A',
      explanationEn: 'Dipole moment $p = q \\times 2a = 2 \\times 10^{-6}\\text{ C} \\times 0.1\\text{ m} = 2 \\times 10^{-7}\\text{ C}\\cdot\\text{m}$.',
      explanationBn: 'তড়িৎ দ্বিমেরু ভ্রামক $p = q \\times 2a = 2 \\times 10^{-6} \\times 0.10 = 2 \\times 10^{-7}\\text{ C}\\cdot\\text{m}$।',
      formula: 'p = q \\times 2a',
      isPublished: true,
    },
  ];

  const handleLoadSample = () => {
    setJsonInput(JSON.stringify(sampleQuestions, null, 2));
    setError('');
    setResult(null);
  };

  const handleImport = async () => {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (err: any) {
        throw new Error('Invalid JSON format. Please check for syntax or comma errors.');
      }

      if (!Array.isArray(parsedData)) {
        throw new Error('JSON root must be an array of question objects [ { ... }, { ... } ]');
      }

      const res = await fetch('/api/admin/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: parsedData }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload questions');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link href="/admin" className="text-xs text-slate-400 hover:text-amber-400 transition flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Admin</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-amber-400" />
            <span>Bulk Question Importer</span>
          </h1>
          <p className="text-xs text-slate-400 font-bengali">
            JSON বা CSV ফরম্যাটের মাধ্যমে একাধিক প্রশ্ন একবারে ডেটাবেসে ইমপোর্ট করুন
          </p>
        </div>

        <button
          onClick={handleLoadSample}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Load Sample JSON Template</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Bulk Import Completed Successfully!</span>
          </div>
          <div className="text-xs text-emerald-200">
            Total Processed: <strong className="text-white">{result.total}</strong> | Successfully Inserted/Updated: <strong className="text-white">{result.inserted}</strong> | Failed: <strong className="text-white">{result.failed}</strong>
          </div>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2 p-3 bg-red-950/40 rounded-xl border border-red-900 text-xs text-red-300 space-y-1">
              <div className="font-bold">Errors encounterd:</div>
              {result.errors.map((e: any, idx: number) => (
                <div key={idx}>• Question {e.code || e.index}: {e.error}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Form */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Questions JSON Payload
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            Format: Array of Objects
          </span>
        </div>

        <textarea
          rows={14}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`[\n  {\n    "code": "WB12-CH01-Q012",\n    "chapterSlug": "electrostatics",\n    "difficulty": "MEDIUM",\n    "questionEn": "...",\n    "questionBn": "...",\n    "optionA_En": "...",\n    "optionA_Bn": "...",\n    "optionB_En": "...",\n    "optionB_Bn": "...",\n    "optionC_En": "...",\n    "optionC_Bn": "...",\n    "optionD_En": "...",\n    "optionD_Bn": "...",\n    "correctOption": "A",\n    "explanationEn": "...",\n    "explanationBn": "..."\n  }\n]`}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-amber-400 leading-relaxed"
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleImport}
            disabled={!jsonInput.trim() || loading}
            className="px-7 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{loading ? 'Processing Import...' : 'Import Questions to Database'}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
