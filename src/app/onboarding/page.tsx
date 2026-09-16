'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getDistrictsForState, INDIAN_STATES } from '@/data/indiaLocations';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Sprout, MapPin, Droplets, Layers, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const { t, language, setLanguage } = useLanguage();
  const { user, farm, activeCrop, updateProfile, updateFarm, setActiveCrop } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);

  // Form State
  const [lang, setLang] = useState<'en' | 'hi'>(language);
  const [state, setState] = useState(user?.state || 'Punjab');
  const [district, setDistrict] = useState(user?.district || 'Ludhiana');
  const [village, setVillage] = useState(user?.village || 'Samrala');
  
  const [landSize, setLandSize] = useState(farm?.land_size || 2.5);
  const [irrigation, setIrrigation] = useState(farm?.irrigation_type || 'Borewell');
  const [soilType, setSoilType] = useState(farm?.soil_type || 'Loam');
  
  const [cropName, setCropName] = useState(activeCrop?.crop_name || 'Wheat');
  const [cropStage, setCropStage] = useState(activeCrop?.crop_stage || 'Vegetative');
  const districts = getDistrictsForState(state);

  const handleFinish = () => {
    setLanguage(lang);
    updateProfile({ language: lang, state, district, village });
    updateFarm({ land_size: Number(landSize), irrigation_type: irrigation as any, soil_type: soilType as any });
    setActiveCrop({
      id: 'farmer-crop-1',
      farm_id: farm?.id || 'demo-farm-id',
      crop_id: 'crop-2',
      crop_stage: cropStage as any,
      sowing_date: '2025-11-15',
      crop_name: cropName
    });
    router.push('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-agri-green-700 mx-auto flex items-center justify-center text-white font-black shadow-md">
          <Sprout className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-agri-green-900">
          {t.onboarding.welcome}
        </h1>
        <p className="text-xs font-semibold text-gray-600">
          {t.onboarding.subtitle}
        </p>
      </div>

      {/* Wizard Progress Bar */}
      <div className="flex items-center justify-between px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center ${
              step >= s ? 'bg-agri-green-700 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
            <span className="text-xs font-extrabold text-agri-green-900">
              {s === 1 ? (language === 'hi' ? 'भाषा व स्थान' : 'Lang & Place') :
               s === 2 ? (language === 'hi' ? 'खेत व मिट्टी' : 'Farm & Soil') :
               (language === 'hi' ? 'फसल विवरण' : 'Crop Details')}
            </span>
          </div>
        ))}
      </div>

      <Card className="shadow-lg border-emerald-200">
        
        {/* Step 1: Language & Location */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-base font-extrabold text-agri-green-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-agri-green-700" />
              <span>Language & Village Location</span>
            </h3>

            <div>
              <label className="block text-xs font-extrabold text-agri-green-900 mb-2">Preferred Language</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setLang('hi'); setLanguage('hi'); }}
                  className={`p-3 rounded-xl border font-bold text-sm ${lang === 'hi' ? 'bg-agri-green-700 text-white border-agri-green-800' : 'bg-gray-50 border-gray-300'}`}
                >
                  हिंदी (Hindi)
                </button>
                <button
                  type="button"
                  onClick={() => { setLang('en'); setLanguage('en'); }}
                  className={`p-3 rounded-xl border font-bold text-sm ${lang === 'en' ? 'bg-agri-green-700 text-white border-agri-green-800' : 'bg-gray-50 border-gray-300'}`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-agri-green-900 mb-1">{t.onboarding.state}</label>
                <select
                  value={state}
                  onChange={(e) => {
                    const nextState = e.target.value;
                    setState(nextState);
                    setDistrict(getDistrictsForState(nextState)[0] || '');
                  }}
                  required
                  className="w-full p-3 rounded-xl border border-gray-300 font-bold text-sm bg-white"
                >
                  {INDIAN_STATES.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-agri-green-900 mb-1">{t.onboarding.district}</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  disabled={!districts.length}
                  className="w-full p-3 rounded-xl border border-gray-300 font-bold text-sm bg-white disabled:bg-gray-100"
                >
                  {districts.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-agri-green-900 mb-1">{t.onboarding.village}</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300 font-bold text-sm"
              />
            </div>

            <Button fullWidth size="lg" onClick={() => setStep(2)}>
              <span>Next: Farm Details</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Land Size, Irrigation, Soil */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-base font-extrabold text-agri-green-900 flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-agri-green-700" />
              <span>Land Size, Irrigation & Soil Type</span>
            </h3>

            <div>
              <label className="block text-xs font-extrabold text-agri-green-900 mb-1">Land Size (in Acres)</label>
              <input
                type="number"
                step="0.5"
                value={landSize}
                onChange={(e) => setLandSize(parseFloat(e.target.value) || 1)}
                className="w-full p-3 rounded-xl border border-gray-300 font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-agri-green-900 mb-1">Irrigation Source</label>
              <select
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-gray-300 font-bold text-sm bg-white"
              >
                <option value="Borewell">Borewell (ट्यूबवेल)</option>
                <option value="Rainfed">Rainfed (वर्षा आधारित)</option>
                <option value="Canal">Canal (नहर)</option>
                <option value="Drip">Drip Irrigation (ड्रिप)</option>
                <option value="Sprinkler">Sprinkler (फव्वारा)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-agri-green-900 mb-1">Soil Texture / Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-gray-300 font-bold text-sm bg-white"
              >
                <option value="Loam">Loam (दोमट मिट्टी)</option>
                <option value="Clay">Clay (चिकनी मिट्टी)</option>
                <option value="Sandy">Sandy (बलुई मिट्टी)</option>
                <option value="Black">Black Soil (काली मिट्टी)</option>
                <option value="Red">Red Soil (लाल मिट्टी)</option>
                <option value="Alluvial">Alluvial (जलोढ़ मिट्टी)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setStep(1)}>Back</Button>
              <Button fullWidth size="lg" onClick={() => setStep(3)}>
                <span>Next: Active Crop</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Current Crop & Stage */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-base font-extrabold text-agri-green-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-agri-green-700" />
              <span>Current Sown Crop & Stage</span>
            </h3>

            <div>
              <label className="block text-xs font-extrabold text-agri-green-900 mb-1">Select Current Crop</label>
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
              <label className="block text-xs font-extrabold text-agri-green-900 mb-1">Current Crop Stage</label>
              <div className="grid grid-cols-2 gap-2">
                {['Sowing', 'Vegetative', 'Flowering', 'Harvesting'].map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setCropStage(stage as any)}
                    className={`p-3 rounded-xl border text-xs font-bold ${
                      cropStage === stage ? 'bg-agri-green-700 text-white border-agri-green-800' : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setStep(2)}>Back</Button>
              <Button fullWidth size="lg" onClick={handleFinish}>
                <span>Save Profile & Open Dashboard</span>
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

      </Card>

    </div>
  );
}
