'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  PlusCircle,
  FileText,
  UploadCloud,
  Layers,
  ArrowLeft,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || data.user.role !== 'ADMIN') {
          router.push('/auth/login');
        } else {
          setIsAdmin(true);
        }
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Verifying Admin Permissions...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const adminLinks = [
    { href: '/admin', label: 'Admin Overview', icon: LayoutDashboard },
    { href: '/admin/questions', label: 'Manage Questions', icon: FileText },
    { href: '/admin/questions/new', label: 'Create New MCQ', icon: PlusCircle },
    { href: '/admin/bulk-upload', label: 'Bulk CSV / JSON Upload', icon: UploadCloud },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Top Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white">
                JB Physics — Creator Admin Dashboard
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                Creator Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Create bilingual MCQs, configure 3D simulations, and publish directly to students
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Student View</span>
        </Link>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Admin Page Body */}
      <div>{children}</div>

    </div>
  );
}
