'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  UploadCloud,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Edit,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/questions').then((r) => r.json()),
      fetch('/api/chapters').then((r) => r.json()),
    ])
      .then(([qData, cData]) => {
        if (qData.questions) setQuestions(qData.questions);
        if (cData.chapters) setChapters(cData.chapters);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalSimulations = questions.filter((q) => !!q.simulationType).length;

  return (
    <div className="space-y-8">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total MCQs</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {questions.length}
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">প্রশ্ন সংখ্যা</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Chapters</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
            {chapters.length}
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">সক্রীয় অধ্যায়</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">3D Simulations</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
            {totalSimulations}
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">সিমুলেশন যুক্ত প্রশ্ন</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Access Plan</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
            100% Free
          </div>
          <div className="text-[11px] text-slate-500 font-bengali">সম্পূর্ণ বিনামূল্যে</div>
        </div>

      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/questions/new"
          className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-400 transition flex items-center justify-between group shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">
                Create New Bilingual Question
              </h3>
              <p className="text-xs text-slate-400 font-bengali">
                নতুন বাংলা ও ইংরেজি এমসিকিউ তৈরি করুন লাইভ প্রিভিউ সহ
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          href="/admin/bulk-upload"
          className="p-6 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-slate-900 to-slate-900 border border-cyan-500/30 hover:border-cyan-400 transition flex items-center justify-between group shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
                Bulk Upload Questions
              </h3>
              <p className="text-xs text-slate-400 font-bengali">
                CSV বা JSON ফাইলের মাধ্যমে একবারে একাধিক প্রশ্ন আপলোড করুন
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Recent Questions Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Question Bank Overview ({questions.length} Items)</span>
          </h2>
          <Link
            href="/admin/questions"
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Chapter</th>
                <th className="p-3">English Question</th>
                <th className="p-3">Correct</th>
                <th className="p-3">Simulation</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {questions.slice(0, 6).map((q) => (
                <tr key={q.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-amber-400">{q.code}</td>
                  <td className="p-3 text-slate-400">{q.chapter?.titleEn || 'Unit'}</td>
                  <td className="p-3 max-w-xs truncate font-medium text-slate-200">{q.questionEn}</td>
                  <td className="p-3 font-bold text-emerald-400 font-mono">({q.correctOption})</td>
                  <td className="p-3">
                    {q.simulationType ? (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/20">
                        {q.simulationType}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/questions/${q.id}/edit`}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 rounded-lg text-[11px] font-bold transition inline-flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
