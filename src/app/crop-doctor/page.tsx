'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Camera, ChevronRight, ClipboardCheck, Leaf, ShieldAlert, Stethoscope } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const symptoms = [
  ['yellow', 'Yellowing leaves', 'पीले पत्ते'],
  ['spots', 'Spots or lesions', 'धब्बे या घाव'],
  ['curling', 'Leaf curl / twisting', 'पत्ते मुड़ना'],
  ['wilting', 'Wilting / drooping', 'मुरझाना'],
  ['insects', 'Visible insects', 'कीट दिखना'],
] as const;

export default function CropDoctorPage() {
  const { activeCrop } = useAuth();
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState(false);
  const crop = activeCrop?.crop_name || (isHindi ? 'फसल' : 'crop');

  function toggle(id: string) { setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); }
  const urgent = selected.includes('wilting') || selected.includes('spots');

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      <section className="rounded-3xl bg-gradient-to-br from-rose-900 via-rose-800 to-orange-800 text-white p-6 sm:p-8 shadow-lg">
        <div className="flex gap-3 items-start">
          <Stethoscope className="w-9 h-9 text-amber-200 shrink-0" />
          <div>
            <p className="text-xs uppercase tracking-widest font-black text-rose-200">{isHindi ? 'प्रारंभिक फसल जांच' : 'Early crop check'}</p>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">{isHindi ? 'समस्या जल्दी पहचानें' : 'Spot field problems early'}</h1>
            <p className="text-sm text-rose-100 mt-2">{isHindi ? 'यह निदान नहीं है—यह आपको सुरक्षित अगला कदम चुनने में मदद करता है।' : 'This is not a diagnosis—it helps you choose a safe next step.'}</p>
          </div>
        </div>
      </section>

      <Card className="space-y-4 border-rose-200">
        <div className="flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-700" /><h2 className="font-black text-agri-green-900">{isHindi ? `${crop} में क्या दिख रहा है?` : `What do you see on the ${crop}?`}</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {symptoms.map(([id, en, hi]) => (
            <button key={id} type="button" onClick={() => toggle(id)} className={`text-left rounded-xl border p-4 text-sm font-bold transition ${selected.includes(id) ? 'bg-rose-50 border-rose-400 text-rose-950' : 'border-slate-200 hover:border-rose-300 text-slate-700'}`}>
              {isHindi ? hi : en}
            </button>
          ))}
        </div>
        <Button type="button" fullWidth onClick={() => setResult(true)} disabled={!selected.length}>{isHindi ? 'सुरक्षित अगला कदम देखें' : 'See the safe next step'}<ChevronRight className="w-4 h-4 ml-2" /></Button>
      </Card>

      {result && (
        <Card className={`${urgent ? 'border-amber-300 bg-amber-50/60' : 'border-emerald-200 bg-emerald-50/50'} space-y-4`}>
          <div className="flex gap-3"><ClipboardCheck className="w-6 h-6 text-agri-green-700 shrink-0" /><div><h2 className="font-black text-agri-green-900">{urgent ? (isHindi ? 'आज ही खेत की जांच करें' : 'Inspect the field today') : (isHindi ? 'पहले निरीक्षण करें' : 'Inspect before treating')}</h2><p className="text-sm text-slate-700 mt-1">{urgent ? (isHindi ? 'प्रभावित और स्वस्थ पौधों की तुलना करें; फैलाव, नमी और कीटों को नोट करें।' : 'Compare affected and healthy plants; note spread, moisture, and insects.') : (isHindi ? 'सुबह 10 पौधों की जांच करें और तस्वीर/नोट तैयार रखें।' : 'Inspect 10 plants in the morning and keep photos or notes ready.')}</p></div></div>
          <div className="rounded-xl bg-white/80 border border-slate-200 p-4 flex gap-3"><ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" /><p className="text-xs font-semibold text-slate-700">{isHindi ? 'बिना पुष्टि के कीटनाशक न मिलाएं या न छिड़कें। पैकेट के लेबल और स्थानीय KVK/कृषि अधिकारी से सलाह लें।' : 'Do not mix or spray pesticide without confirmation. Follow the product label and contact a local KVK/agriculture officer.'}</p></div>
          <Link href="/ai-assistant" className="inline-flex items-center gap-2 text-sm font-black text-rose-800 hover:text-rose-950"><Camera className="w-4 h-4" />{isHindi ? 'सहायक से लक्षण बताएं' : 'Describe symptoms to the assistant'}</Link>
        </Card>
      )}
    </div>
  );
}
