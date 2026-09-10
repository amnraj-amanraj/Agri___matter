'use client';

import { FormEvent, useState } from 'react';
import { AlertCircle, ArrowUpDown, CalendarDays, MapPin, Search, Store } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type MandiRecord = { state: string; district: string; market: string; commodity: string; variety: string; minPrice: number | null; maxPrice: number | null; modalPrice: number | null; date: string };
type ApiPayload = { success: boolean; records?: MandiRecord[]; source?: 'data.gov.in' | 'cache'; fetchedAt?: string; warning?: string; error?: string };

export default function MandiPage() {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';
  const copy = t.mandiPage;
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [commodity, setCommodity] = useState('');
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [source, setSource] = useState<ApiPayload['source']>();
  const [fetchedAt, setFetchedAt] = useState('');

  async function searchPrices(event?: FormEvent) {
    event?.preventDefault();
    setStatus('loading');
    setMessage('');
    const params = new URLSearchParams();
    if (state.trim()) params.set('state', state.trim());
    if (district.trim()) params.set('district', district.trim());
    if (commodity.trim()) params.set('commodity', commodity.trim());
    try {
      const response = await fetch(`/api/mandi?${params.toString()}`, { cache: 'no-store' });
      const payload = await response.json() as ApiPayload;
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Mandi data is unavailable.');
      setRecords(payload.records ?? []);
      setSource(payload.source);
      setFetchedAt(payload.fetchedAt || '');
      setMessage(payload.warning || '');
      setStatus('idle');
    } catch (error) {
      setRecords([]);
      setSource(undefined);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Mandi data is unavailable.');
    }
  }

  const speak = () => {
    if (!records.length || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const first = records[0];
    const text = isHindi ? `${first.commodity} का मंडी भाव ${first.modalPrice ?? first.maxPrice ?? 'उपलब्ध नहीं'} रुपये प्रति क्विंटल है।` : `${first.commodity} modal mandi price is ${first.modalPrice ?? first.maxPrice ?? 'not available'} rupees per quintal.`;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  return (
    <div className="space-y-6 py-2">
      <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-emerald-950 via-emerald-800 to-agri-brown-900 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100"><Store className="h-3.5 w-3.5 text-amber-300" />{copy.eyebrow}</div>
          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">{copy.title}</h1>
          <p className="text-sm font-medium leading-relaxed text-emerald-100">{copy.subtitle}</p>
        </div>
      </section>

      <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/50 p-5">
        <form onSubmit={searchPrices} className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <label className="text-xs font-black text-agri-green-900">{copy.state}<input value={state} onChange={(event) => setState(event.target.value)} placeholder={copy.statePlaceholder} className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white p-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
          <label className="text-xs font-black text-agri-green-900">{copy.district}<input value={district} onChange={(event) => setDistrict(event.target.value)} placeholder={copy.districtPlaceholder} className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white p-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
          <label className="text-xs font-black text-agri-green-900">{copy.crop}<input value={commodity} onChange={(event) => setCommodity(event.target.value)} placeholder={copy.cropPlaceholder} className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white p-3 text-sm font-semibold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
          <Button type="submit" disabled={status === 'loading'}><Search className="mr-2 h-4 w-4" />{status === 'loading' ? copy.searching : copy.findPrices}</Button>
        </form>
      </Card>

      {message && <div className={`rounded-2xl border p-4 text-sm font-semibold ${status === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}><div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{message}</div></div>}

      {records.length > 0 && <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-black text-agri-green-900">{copy.records}</h2><p className="text-xs font-semibold text-gray-500">{source === 'cache' ? copy.cachedRecords : copy.liveRecords} {fetchedAt && `• ${new Date(fetchedAt).toLocaleString('en-IN')}`}</p></div><Button type="button" variant="secondary" onClick={speak}>{copy.readAloud}</Button></div>
        <div className="grid gap-4 lg:grid-cols-2">{records.map((record, index) => <Card key={`${record.market}-${record.commodity}-${record.date}-${index}`} className="space-y-4 border-emerald-100 bg-white"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-black text-agri-green-900">{record.commodity || copy.cropRecord}</h3><p className="mt-1 flex items-center gap-1 text-xs font-bold text-gray-500"><MapPin className="h-3.5 w-3.5 text-emerald-700" />{record.market || copy.records}{record.district && `, ${record.district}`}</p></div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-800">{record.variety || copy.varietyUnavailable}</span></div><div className="grid grid-cols-3 gap-2">{[['Min', record.minPrice], ['Modal', record.modalPrice], ['Max', record.maxPrice]].map(([label, value]) => <div key={label} className={`rounded-xl p-3 ${label === 'Modal' ? 'bg-amber-50' : 'bg-emerald-50'}`}><div className="text-lg font-black text-agri-green-900">{value === null ? '—' : `₹${value.toLocaleString('en-IN')}`}</div><div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label} / {copy.quintal}</div></div>)}</div><div className="flex items-center gap-2 border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500"><CalendarDays className="h-4 w-4 text-emerald-700" />{record.date || copy.dateUnavailable}</div></Card>)}</div>
      </section>}

      {!records.length && status === 'idle' && !message && <div className="rounded-2xl border border-dashed border-emerald-300 p-10 text-center"><ArrowUpDown className="mx-auto mb-3 h-8 w-8 text-emerald-700" /><p className="font-black text-agri-green-900">{copy.startTitle}</p><p className="mt-1 text-sm font-semibold text-gray-500">{copy.startSubtitle}</p></div>}

      <p className="text-xs font-semibold leading-relaxed text-gray-500">{copy.sourceNote}</p>
    </div>
  );
}
