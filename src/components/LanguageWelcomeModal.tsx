'use client';

import React, { useEffect, useState } from 'react';
import { Check, Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/types';

export function LanguageWelcomeModal() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('agrimatter_language');
    if (savedLanguage === 'en' || savedLanguage === 'hi') {
      setSelectedLanguage(savedLanguage);
      return;
    }
    setIsOpen(true);
  }, []);

  const chooseLanguage = (nextLanguage: Language) => {
    setSelectedLanguage(nextLanguage);
    setLanguage(nextLanguage);
  };

  const continueToWebsite = () => {
    localStorage.setItem('agrimatter_language', selectedLanguage);
    setLanguage(selectedLanguage);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="language-dialog-title">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-agri-green-100 text-agri-green-800">
          <Languages className="h-7 w-7" />
        </div>
        <h2 id="language-dialog-title" className="mt-5 text-center text-2xl font-black text-agri-green-950">
          भाषा चुनें / Choose your language
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-gray-600">
          अपनी पसंदीदा भाषा चुनें ताकि Agrimatter आपके लिए बेहतर अनुभव दे सके।
          <br />
          Select your preferred language for a better Agrimatter experience.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {([
            { value: 'hi' as const, label: 'हिंदी', detail: 'Hindi' },
            { value: 'en' as const, label: 'English', detail: 'English' },
          ]).map((option) => {
            const isSelected = selectedLanguage === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => chooseLanguage(option.value)}
                className={`relative rounded-2xl border-2 p-4 text-left transition ${isSelected ? 'border-agri-green-700 bg-agri-green-50 text-agri-green-950' : 'border-gray-200 bg-white text-gray-700 hover:border-agri-green-300'}`}
                aria-pressed={isSelected}
              >
                {isSelected && <Check className="absolute right-3 top-3 h-5 w-5 text-agri-green-700" />}
                <span className="block text-lg font-black">{option.label}</span>
                <span className="mt-1 block text-xs font-semibold text-gray-500">{option.detail}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={continueToWebsite}
          className="mt-6 w-full rounded-2xl bg-agri-green-700 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-agri-green-800 focus:outline-none focus:ring-2 focus:ring-agri-green-500 focus:ring-offset-2"
        >
          {selectedLanguage === 'hi' ? 'आगे बढ़ें' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
