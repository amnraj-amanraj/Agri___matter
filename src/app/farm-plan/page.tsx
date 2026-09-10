'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, CloudSun, Droplets, Leaf, Mic, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui/Card';

type Task = { id: string; title: string; detail: string; icon: typeof Droplets; href: string };

export default function FarmPlanPage() {
  const { activeCrop } = useAuth();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const storageKey = `agrimatter-plan-${new Date().toISOString().slice(0, 10)}`;
  const [complete, setComplete] = useState<string[]>([]);

  const tasks = useMemo<Task[]>(() => {
    const crop = activeCrop?.crop_name || (isHindi ? 'आपकी फसल' : 'your crop');
    const stage = activeCrop?.crop_stage || 'Vegetative';
    const stageTask = stage === 'Sowing'
      ? isHindi ? `${crop} की बुवाई के बाद नमी जांचें` : `Check moisture after sowing ${crop}`
      : stage === 'Flowering'
      ? isHindi ? `${crop} में फूल और कीट के संकेत देखें` : `Inspect ${crop} flowers and pest signs`
      : stage === 'Harvesting'
      ? isHindi ? `${crop} की कटाई और भंडारण की तैयारी करें` : `Prepare ${crop} harvest and storage`
      : isHindi ? `${crop} में पत्तियों और खरपतवार की जांच करें` : `Inspect ${crop} leaves and weeds`;

    return [
      { id: 'weather', title: isHindi ? 'सुबह मौसम देखें' : 'Check the morning weather', detail: isHindi ? 'बारिश या तेज हवा हो तो छिड़काव रोकें।' : 'Pause spraying if rain or strong wind is forecast.', icon: CloudSun, href: '/weather' },
      { id: 'field', title: stageTask, detail: isHindi ? 'खेत की एक छोटी सैर से समस्या जल्दी दिखती है।' : 'A short field walk finds problems early.', icon: Leaf, href: '/crop-doctor' },
      { id: 'water', title: isHindi ? 'सिंचाई का निर्णय लें' : 'Decide on irrigation', detail: isHindi ? 'मिट्टी की ऊपरी परत और मौसम देखकर ही पानी दें।' : 'Water only after checking topsoil moisture and the forecast.', icon: Droplets, href: '/weather' },
      { id: 'ask', title: isHindi ? 'सवाल हो तो आवाज़ में पूछें' : 'Ask a question by voice', detail: isHindi ? 'बिना टाइप किए स्थानीय भाषा में सहायता पाएं।' : 'Get help in your language without typing.', icon: Mic, href: '/ai-assistant' },
    ];
  }, [activeCrop, isHindi]);

  useEffect(() => {
    try { setComplete(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { setComplete([]); }
  }, [storageKey]);

  function toggle(id: string) {
    setComplete((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-emerald-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="flex gap-3 items-start">
          <CalendarDays className="w-9 h-9 text-amber-300 shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-widest font-black text-indigo-200">{isHindi ? 'दैनिक खेती की योजना' : 'Daily farm plan'}</p>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">{isHindi ? 'आज खेत में क्या करें?' : 'What should I do in the field today?'}</h1>
            <p className="text-sm text-indigo-100 mt-2">{isHindi ? 'कार्य पूरे होने पर टिक करें। यह सूची केवल इस डिवाइस में सेव होती है।' : 'Tick tasks as you complete them. This list is saved only on this device.'}</p>
          </div>
        </div>
      </section>

      <Card className="border-amber-200 bg-amber-50/60 flex gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
        <p className="text-xs font-semibold text-amber-950">{isHindi ? 'खाद, कीटनाशक या रोग के लिए अंतिम निर्णय स्थानीय कृषि अधिकारी, लेबल निर्देश और मिट्टी जांच के साथ लें।' : 'Confirm fertilizer, pesticide, and disease decisions with local extension guidance, label directions, and soil-test results.'}</p>
      </Card>

      <section className="space-y-3" aria-label="Today’s farm tasks">
        {tasks.map((task) => {
          const done = complete.includes(task.id);
          const Icon = task.icon;
          return (
            <Card key={task.id} className={`flex gap-4 items-center transition ${done ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200'}`}>
              <button type="button" onClick={() => toggle(task.id)} aria-label={`Mark ${task.title} complete`} className={`shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center ${done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 text-slate-400'}`}>
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <Icon className="w-6 h-6 text-indigo-700 shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className={`text-sm font-black ${done ? 'line-through text-slate-500' : 'text-agri-green-900'}`}>{task.title}</h2>
                <p className="text-xs text-slate-600 mt-1">{task.detail}</p>
              </div>
              <Link href={task.href} className="text-xs font-black text-indigo-700 hover:text-indigo-900 whitespace-nowrap">{isHindi ? 'खोलें' : 'Open'}</Link>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
