'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Sparkles,
  Youtube,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/questions';
      if (search) url += `?search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.questions) setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Question Bank Manager
          </h1>
          <p className="text-xs text-slate-400">
            View, edit, filter, and manage all {questions.length} physics questions
          </p>
        </div>

        <Link
          href="/admin/questions/new"
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Question</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchQuestions()}
          placeholder="Search question code, statement, or chapter..."
          className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none"
        />
        <button
          onClick={fetchQuestions}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-3.5">Code</th>
                <th className="p-3.5">Chapter</th>
                <th className="p-3.5">Bengali / English Statement</th>
                <th className="p-3.5">Correct</th>
                <th className="p-3.5">Sim / Video</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Loading questions...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No questions found.
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {q.code}
                    </td>
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {q.chapter?.titleEn || 'Class 12'}
                    </td>
                    <td className="p-3.5 max-w-sm">
                      <div className="font-bengali text-white truncate font-medium">{q.questionBn}</div>
                      <div className="text-slate-400 truncate text-[11px]">{q.questionEn}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      ({q.correctOption})
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {q.simulationType && (
                          <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" title={q.simulationType}>
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {q.youtubeUrl && (
                          <span className="p-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30" title="YouTube Video Linked">
                            <Youtube className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/questions/${q.id}/edit`}
                          className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                          title="Edit Question"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
