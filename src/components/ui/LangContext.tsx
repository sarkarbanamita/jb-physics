'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageMode = 'en' | 'bn' | 'both';

interface LangContextType {
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
}

const LangContext = createContext<LangContextType>({
  lang: 'both',
  setLang: () => {},
});

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageMode>('both');

  useEffect(() => {
    const saved = localStorage.getItem('jb_language_mode') as LanguageMode | null;
    if (saved && (saved === 'en' || saved === 'bn' || saved === 'both')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: LanguageMode) => {
    setLangState(newLang);
    localStorage.setItem('jb_language_mode', newLang);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLanguage = () => useContext(LangContext);
