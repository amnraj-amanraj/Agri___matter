'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getFertilizerAdvice } from '@/lib/advisory-engine';
import { FertilizerAdvice } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Sprout, AlertTriangle, ShieldCheck, CheckCircle2, Leaf } from 'lucide-react';

export default function FertilizerGuidePage() {
  const { t, language } = useLanguage();
  const { activeCrop } = useAuth();

  const [cropName, setCropName] = useState(activeCrop?.crop_name || 'Wheat');
  const [stage, setStage] = useState<'Sowing' | 'Vegetative' | 'Flowering' | 'Harvesting'>(
    activeCrop?.crop_stage || 'Vegetative'
  );

  const [guide, setGuide] = useState<FertilizerAdvice>(() => getFertilizerAdvice(cropName, stage));

  const handleUpdate = () => {
    setGuide(getFertilizerAdvice(cropName, stage));
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-agri-green-900">
          {t.fertilizerPage.title}
        </h1>
        <p className="text-xs font-semibold text-gray-600">
          {language === 'hi' ? 'बुवाई, वानस्पतिक वृद्धि और पुष्पन अवस्था के अनुसार खाद मार्गदर्शन' : 'Stage-wise nutrient guidance customized for your crop'}
        </p>
      </div>

      {/* Mandatory Safety Disclaimer Banner */}
      <Alert type="warning" title={t.common.disclaimerTitle}>
        <p className="text-sm font-black text-amber-950">
          {t.common.fertilizerDisclaimer}
        </p>
      </Alert>

      {/* Selector controls */}
      <Card className="bg-amber-50/40 border-amber-200 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-xs font-extrabold text-agri-green-900 mb-1">{t.fertilizerPage.selectCrop}</label>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 font-bold text-sm bg-white"
            >
              <option value="Wheat">Wheat (गेहूँ)</option>
              <option value="Rice">Rice / Paddy (धान)</option>
              <option value="Maize">Maize (मक्का)</option>
              <option value="Mustard">Mustard (सरसों)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Tomato">Tomato (टमाटर)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-agri-green-900 mb-1">{t.fertilizerPage.selectStage}</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as any)}
              className="w-full p-3 rounded-xl border border-gray-300 font-bold text-sm bg-white"
            >
              <option value="Sowing">Sowing (बुवाई का समय)</option>
              <option value="Vegetative">Vegetative (वानस्पतिक वृद्धि)</option>
              <option value="Flowering">Flowering (फूल व बाली अवस्था)</option>
              <option value="Harvesting">Harvesting (पकाई / कटाई का समय)</option>
            </select>
          </div>

        </div>

        <Button onClick={handleUpdate} fullWidth size="lg" variant="amber">
          <Sprout className="w-5 h-5 mr-2" />
          <span>{t.fertilizerPage.getGuideBtn}</span>
        </Button>
      </Card>

      {/* Advice Display Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Main Stage Guidance */}
        <Card className="space-y-4 border-2 border-agri-green-700 bg-white shadow-md">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-lg font-black text-agri-green-900">{guide.cropName} - {guide.stage}</h3>
            <Badge variant="green">{guide.stage}</Badge>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h4 className="text-xs font-extrabold text-agri-green-900 uppercase mb-1">Stage Advisory</h4>
            <p className="text-sm font-bold text-gray-800 leading-relaxed">
              {guide.generalAdvice[language]}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-agri-green-900 uppercase">General Reference Dosages</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-extrabold">
              <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px]">Urea / N</span>
                <span className="text-agri-green-900">{guide.nitrogenDosage}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px]">SSP / P</span>
                <span className="text-agri-green-900">{guide.phosphorusDosage}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-gray-500 block text-[10px]">MOP / K</span>
                <span className="text-agri-green-900">{guide.potassiumDosage}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Organic Alternatives & Eco Tips */}
        <Card className="space-y-4 border-emerald-200 bg-amber-50/20">
          <div className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-agri-green-700" />
            <h3 className="text-base font-black text-agri-green-900">Eco & Organic Alternatives</h3>
          </div>

          <div className="space-y-2">
            {guide.organicAlternatives[language].map((alt, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs font-bold text-gray-800 p-3 bg-white rounded-xl border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{alt}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-100/70 rounded-xl text-xs font-extrabold text-amber-950 flex items-start space-x-2 border border-amber-300">
            <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <span>Always apply chemical fertilizers when soil has sufficient moisture. Avoid broadcasting dry urea under scorching sun.</span>
          </div>
        </Card>

      </div>

    </div>
  );
}
