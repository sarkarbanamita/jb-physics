'use client';

import React from 'react';
import { useLanguage, LanguageMode } from './LangContext';
import { Languages } from 'lucide-react';

interface LangToggleProps {
  compact?: boolean;
}

export const LangToggle: React.FC<LangToggleProps> = ({ compact = false }) => {
  const { lang, setLang } = useLanguage();

  const options: { id: LanguageMode; label: string; shortLabel: string }[] = [
    { id: 'en', label: 'English', shortLabel: 'EN' },
    { id: 'bn', label: 'বাংলা', shortLabel: 'বাং' },
    { id: 'both', label: 'English + বাংলা', shortLabel: 'EN+বাং' },
  ];

  return (
    <div className="inline-flex items-center p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-sm">
      <div className="px-2 text-slate-400 hidden sm:flex items-center gap-1.5 text-xs">
        <Languages className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-medium text-[11px] uppercase tracking-wider">Lang:</span>
      </div>
      <div className="flex gap-1">
        {options.map((opt) => {
          const isActive = lang === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setLang(opt.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={opt.label}
            >
              {compact ? opt.shortLabel : opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LangToggle;
