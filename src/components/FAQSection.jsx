'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, Search, HelpCircle, Languages, SlidersHorizontal, X } from 'lucide-react';
import faqs from '../data/faqs.json';

// Keep the FAQ UI self-contained and lightweight for slow connections.
export function FAQSection({ initialLanguage = 'hi' }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openId, setOpenId] = useState(null);

  const categories = useMemo(() => {
    const uniqueCategories = faqs.reduce((result, faq) => {
      if (!result.some((category) => category.category === faq.category)) {
        result.push({ category: faq.category, category_hi: faq.category_hi });
      }
      return result;
    }, []);
    return [{ category: 'all', category_hi: 'सभी सवाल' }, ...uniqueCategories];
  }, []);

  const popularSearches = [
    { en: 'soil test', hi: 'मिट्टी जांच', value: 'soil' },
    { en: 'pesticide safety', hi: 'कीटनाशक सुरक्षा', value: 'pesticide' },
    { en: 'rain and irrigation', hi: 'बारिश और सिंचाई', value: 'rain' },
    { en: 'scheme or subsidy', hi: 'योजना या सब्सिडी', value: 'scheme' },
  ];

  // Search both languages and tags so users can type in the language they know.
  const filteredFaqs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!term) return true;
      return [
      faq.category,
      faq.category_hi,
      faq.question_en,
      faq.question_hi,
      faq.answer_en,
      faq.answer_hi,
      ...faq.tags,
      ].some((value) => value.toLowerCase().includes(term));
    });
  }, [search, selectedCategory]);

  // Group filtered questions by their bilingual category.
  const groups = useMemo(() => filteredFaqs.reduce((result, faq) => {
    const key = faq.category;
    if (!result[key]) {
      result[key] = { category: faq.category, category_hi: faq.category_hi, items: [] };
    }
    result[key].items.push(faq);
    return result;
  }, {}), [filteredFaqs]);

  const isHindi = language === 'hi';

  return (
    <section className="space-y-6 rounded-[30px] border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/50 px-4 py-8 shadow-sm sm:px-8" aria-labelledby="faq-title">
      {/* Header and language switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-700">
            <HelpCircle className="h-4 w-4" />
            {isHindi ? 'किसान मदद केंद्र' : 'Farmer help centre'}
          </div>
          <h2 id="faq-title" className="text-2xl font-black text-agri-green-900 sm:text-3xl">
            {isHindi ? 'खेती के सवालों के आसान जवाब' : 'Simple answers for everyday farming'}
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-gray-600">
            {isHindi ? 'मिट्टी, मौसम, कीट, योजना या बाजार से जुड़ी समस्या लिखें और सीधे काम का जवाब पाएं।' : 'Search a problem about soil, weather, pests, schemes, markets, or livestock and find a practical answer.'}
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-emerald-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900" role="group" aria-label="FAQ language">
          <button type="button" onClick={() => setLanguage('hi')} aria-pressed={isHindi} className={`min-h-11 rounded-lg px-4 text-base font-black transition ${isHindi ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:bg-emerald-50'}`}>
            हिंदी
          </button>
          <button type="button" onClick={() => setLanguage('en')} aria-pressed={!isHindi} className={`min-h-11 rounded-lg px-4 text-base font-black transition ${!isHindi ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:bg-emerald-50'}`}>
            English
          </button>
        </div>
      </div>

      {/* Search and category controls */}
      <div className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-800">
          <SlidersHorizontal className="h-4 w-4" />
          {isHindi ? 'अपनी समस्या चुनें' : 'Find help by problem'}
        </div>
        <label className="relative block">
        <span className="sr-only">{isHindi ? 'सवाल खोजें' : 'Search questions'}</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-700" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isHindi ? 'जैसे: मिट्टी, बारिश, बीज, subsidy...' : 'Try: soil, rain, seed, subsidy...'} className="min-h-14 w-full rounded-2xl border border-emerald-200 bg-white pl-12 pr-12 text-base font-semibold text-gray-900 shadow-sm outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-emerald-950" />
        {search && <button type="button" onClick={() => setSearch('')} aria-label={isHindi ? 'खोज साफ करें' : 'Clear search'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-500 transition hover:bg-emerald-50 hover:text-emerald-800"><X className="h-4 w-4" /></button>}
        </label>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {popularSearches.map((item) => (
            <button key={item.value} type="button" onClick={() => setSearch(item.value)} className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100">
              {isHindi ? item.hi : item.en}
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label={isHindi ? 'FAQ श्रेणियां' : 'FAQ categories'}>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.category;
            return <button key={category.category} type="button" onClick={() => setSelectedCategory(category.category)} aria-pressed={isSelected} className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-black transition ${isSelected ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-800'}`}>
              {isHindi ? category.category_hi : category.category}
            </button>;
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-emerald-100 pt-3 text-xs font-bold text-gray-500">
          <span>{filteredFaqs.length} {isHindi ? 'सवाल मिले' : filteredFaqs.length === 1 ? 'question found' : 'questions found'}</span>
          {(search || selectedCategory !== 'all') && <button type="button" onClick={() => { setSearch(''); setSelectedCategory('all'); }} className="font-black text-emerald-700 hover:text-emerald-900">{isHindi ? 'सभी फ़िल्टर हटाएं' : 'Clear all filters'}</button>}
        </div>
      </div>

      {/* Accessible category accordions */}
      <div className="space-y-4">
        {Object.values(groups).map((group) => (
          <div key={group.category} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-emerald-100 bg-emerald-50/60 px-4 py-4 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-lg font-black text-agri-green-900 dark:text-emerald-300">{isHindi ? group.category_hi : group.category}</h3>
              <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-slate-300">{group.items.length} {isHindi ? 'सवाल' : 'questions'}</p>
            </div>
            <div className="divide-y divide-emerald-100 dark:divide-slate-700">
              {group.items.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id}>
                    <button type="button" onClick={() => setOpenId(isOpen ? null : faq.id)} aria-expanded={isOpen} aria-controls={`${faq.id}-answer`} className="flex min-h-16 w-full items-center justify-between gap-4 px-4 py-4 text-left text-base font-black text-gray-900 transition hover:bg-emerald-50 dark:text-slate-100 dark:hover:bg-slate-800">
                      <span>{isHindi ? faq.question_hi : faq.question_en}</span>
                      <ChevronDown className={`h-5 w-5 shrink-0 text-emerald-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div id={`${faq.id}-answer`} className="border-t border-emerald-100 bg-white px-4 py-4 text-base leading-relaxed text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                        {isHindi ? faq.answer_hi : faq.answer_en}
                        <div className="mt-3 flex flex-wrap gap-2" aria-label={isHindi ? 'कीवर्ड' : 'Keywords'}>
                          {faq.tags.map((tag) => <span key={tag} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{tag}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!filteredFaqs.length && (
        <div className="rounded-2xl border border-dashed border-emerald-300 p-8 text-center text-base font-bold text-gray-600">
          {isHindi ? 'सवाल नहीं मिला। दूसरा शब्द लिखकर देखें।' : 'No question found. Try another word.'}
        </div>
      )}

      <p className="flex items-start gap-2 text-sm font-semibold text-gray-500">
        <Languages className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        {isHindi ? 'योजना, भाव और हेल्पलाइन की बदलती जानकारी को official source से जरूर जांचें।' : 'Always verify changing scheme, price, and helpline information with an official source.'}
      </p>
    </section>
  );
}

export default FAQSection;
