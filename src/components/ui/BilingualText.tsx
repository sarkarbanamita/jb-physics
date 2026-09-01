'use client';

import React from 'react';
import { useLanguage, LanguageMode } from './LangContext';
import MathRenderer from './MathRenderer';

interface BilingualTextProps {
  en: string;
  bn: string;
  className?: string;
  enClassName?: string;
  bnClassName?: string;
  modeOverride?: LanguageMode;
  layout?: 'stacked' | 'inline' | 'tabs';
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  en,
  bn,
  className = '',
  enClassName = '',
  bnClassName = '',
  modeOverride,
  layout = 'stacked',
}) => {
  const { lang: globalLang } = useLanguage();
  const activeLang = modeOverride || globalLang;

  if (activeLang === 'en') {
    return (
      <div className={`${className} ${enClassName}`}>
        <MathRenderer content={en} />
      </div>
    );
  }

  if (activeLang === 'bn') {
    return (
      <div className={`font-bengali ${className} ${bnClassName}`}>
        <MathRenderer content={bn} />
      </div>
    );
  }

  // Dual mode: show both English & Bengali
  if (layout === 'inline') {
    return (
      <div className={`space-y-1 ${className}`}>
        <div className={`font-bengali text-amber-200/90 ${bnClassName}`}>
          <MathRenderer content={bn} />
        </div>
        <div className={`text-slate-300 text-sm ${enClassName}`}>
          <MathRenderer content={en} />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Bengali Version */}
      <div className={`font-bengali p-2.5 rounded-lg bg-amber-500/5 border-l-2 border-amber-400 text-slate-100 ${bnClassName}`}>
        <div className="text-[10px] font-semibold tracking-wider text-amber-400 uppercase mb-1">বাংলা (Bengali)</div>
        <MathRenderer content={bn} />
      </div>

      {/* English Version */}
      <div className={`p-2.5 rounded-lg bg-slate-800/40 border-l-2 border-cyan-400 text-slate-200 ${enClassName}`}>
        <div className="text-[10px] font-semibold tracking-wider text-cyan-400 uppercase mb-1">English</div>
        <MathRenderer content={en} />
      </div>
    </div>
  );
};

export default BilingualText;
