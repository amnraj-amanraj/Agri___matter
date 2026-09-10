'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BarChart3, MapPin, Sprout, Wheat } from 'lucide-react';
import { stateFarmData } from '@/data/stateFarmData';
import { allStateAgriProfiles } from '@/data/stateAgriProfiles';

const formatIncome = (value: number | null) => value ? `₹${value.toLocaleString('en-IN')}` : 'Not listed';

export function StateFarmExplorer({ language = 'en' }: { language?: string }) {
  const [selectedState, setSelectedState] = useState(stateFarmData[0].state);
  const selected = stateFarmData.find((item) => item.state === selectedState) ?? stateFarmData[0];
  const profile = allStateAgriProfiles[selected.state];
  const isHindi = language === 'hi';

  return (
    <section className="space-y-6 rounded-[30px] border border-emerald-100 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="state-explorer-title">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
            <MapPin className="h-4 w-4" />
            {isHindi ? 'राज्यवार कृषि मानचित्र' : 'India by state'}
          </div>
          <h2 id="state-explorer-title" className="text-2xl font-black tracking-tight text-agri-green-900 sm:text-3xl">
            {isHindi ? 'हर राज्य की अपनी कृषि पहचान' : 'Every state has a farming identity'}
          </h2>
          <p className="text-sm font-semibold leading-relaxed text-gray-600">
            {isHindi ? 'राज्य चुनें और प्रमुख फसल, आय, भूमि जोत और स्थानीय विशेषता एक जगह देखें।' : 'Select a state to explore its major crops, farmer income, land profile, and agricultural specialty.'}
          </p>
        </div>
        <div className="w-full lg:max-w-xs">
          <label htmlFor="state-select" className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-emerald-800">
            {isHindi ? 'राज्य चुनें' : 'Choose a state'}
          </label>
          <select id="state-select" value={selectedState} onChange={(event) => setSelectedState(event.target.value)} className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-agri-green-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100">
            {stateFarmData.map((item) => <option key={item.state} value={item.state}>{isHindi ? item.stateHi : item.state}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/70 p-4 sm:p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">{isHindi ? 'राज्यवार प्रमुख उपज' : 'State-wise farm produce'}</p>
            <h3 className="mt-1 text-lg font-black text-agri-green-900 sm:text-xl">{isHindi ? 'भारत की खेती, एक नज़र में' : 'India’s farming map at a glance'}</h3>
          </div>
          <span className="hidden rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-500 shadow-sm sm:inline-flex">{stateFarmData.length} {isHindi ? 'राज्य' : 'states'}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {stateFarmData.map((item, index) => {
            const isSelected = item.state === selectedState;
            return (
              <button
                key={item.state}
                type="button"
                onClick={() => setSelectedState(item.state)}
                aria-pressed={isSelected}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${isSelected ? 'border-amber-400 ring-2 ring-amber-200' : 'border-emerald-100'}`}
              >
                <span className={`absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${isSelected ? 'bg-amber-400 text-amber-950' : 'bg-emerald-800 text-white'}`}>{index + 1}</span>
                <div className="mx-auto mb-3 relative h-20 w-20 overflow-hidden rounded-full border-4 border-emerald-50 shadow-inner sm:h-24 sm:w-24">
                  <Image src={item.image} alt="" fill sizes="96px" className="object-cover transition duration-500 group-hover:scale-110" />
                </div>
                <div className="text-center">
                  <h4 className="truncate text-xs font-black text-agri-green-900">{isHindi ? item.stateHi : item.state}</h4>
                  <p className="mt-1 line-clamp-2 min-h-[28px] text-[10px] font-semibold leading-tight text-gray-500">{(isHindi ? item.cropsHi : item.crops).slice(0, 2).join(' · ')}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[300px] overflow-hidden rounded-[28px] bg-emerald-900">
          <Image src={selected.image} alt={`${selected.state} farming and ${selected.crops.join(', ')}`} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/15 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 text-white">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5 text-amber-300" />
              {isHindi ? selected.regionHi : selected.region}
            </div>
            <h3 className="text-3xl font-black tracking-tight">{isHindi ? selected.stateHi : selected.state}</h3>
            <p className="mt-1 text-sm font-semibold text-emerald-100">{isHindi ? selected.specialtyHi : selected.specialty}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <BarChart3 className="mb-3 h-5 w-5 text-emerald-700" />
              <div className="text-lg font-black text-agri-green-900">{formatIncome(selected.income)}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{isHindi ? 'मासिक आय' : 'Monthly income'}</div>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <Wheat className="mb-3 h-5 w-5 text-amber-700" />
              <div className="text-lg font-black text-agri-green-900">{selected.land} ha</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{isHindi ? 'औसत जोत' : 'Avg. holding'}</div>
            </div>
            <div className="col-span-2 rounded-2xl border border-sky-100 bg-sky-50 p-4 sm:col-span-1">
              <Sprout className="mb-3 h-5 w-5 text-sky-700" />
              <div className="text-lg font-black text-agri-green-900">{selected.holdings ? `${selected.holdings}M` : '—'}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{isHindi ? 'जोत (मिलियन)' : 'Holdings (million)'}</div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="text-sm font-black uppercase tracking-[0.16em] text-agri-green-900">{isHindi ? 'मुख्य फसलें' : 'Signature crops'}</h4>
              <span className="text-[10px] font-bold text-gray-500">{isHindi ? '2015-16 / 2018-19 स्रोत' : 'Official survey snapshots'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(isHindi ? selected.cropsHi : selected.crops).map((crop) => <span key={crop} className="rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-black text-emerald-800 shadow-sm">{crop}</span>)}
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4 text-xs font-semibold leading-relaxed text-gray-600">
            {isHindi ? 'डेटा स्रोत: NSS Report No. 587 (2018-19) और Agriculture Census 2015-16। आय और जोत के आंकड़े राष्ट्रीय सर्वेक्षण snapshots हैं, वर्तमान बाजार भाव नहीं।' : 'Data sources: NSS Report No. 587 (2018-19) and Agriculture Census 2015-16. Income and land figures are national survey snapshots, not current market prices.'}
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto border-t border-emerald-100 pt-5 pb-1" aria-label={isHindi ? 'राज्य ब्राउज़र' : 'Browse states'}>
        {stateFarmData.map((item) => <button key={item.state} type="button" onClick={() => setSelectedState(item.state)} aria-label={isHindi ? item.stateHi : item.state} aria-pressed={item.state === selectedState} className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 transition ${item.state === selectedState ? 'border-amber-400 ring-4 ring-amber-100' : 'border-white opacity-70 hover:opacity-100'}`}><Image src={item.image} alt="" fill sizes="56px" className="object-cover" /></button>)}
      </div>

      {profile && (
        <div className="space-y-5 rounded-[28px] border border-amber-200 bg-amber-50/50 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">{isHindi ? 'गहन किसान प्रोफाइल' : 'Deep farmer profile'}</p>
              <h3 className="mt-1 text-xl font-black text-agri-green-900">{isHindi ? `${profile.stateHi} की कृषि जानकारी` : `${profile.state} agriculture knowledge base`}</h3>
            </div>
            <span className="rounded-full border border-amber-300 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-900">{isHindi ? 'समीक्षा आवश्यक' : 'Review required'}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              [isHindi ? 'कृषि-जलवायु क्षेत्र' : 'Agro-climatic profile', isHindi ? profile.agroClimaticZoneHi : profile.agroClimaticZone],
              [isHindi ? 'वर्षा पैटर्न' : 'Rainfall', isHindi ? profile.rainfallHi : profile.rainfall],
              [isHindi ? 'मिट्टी' : 'Soil', isHindi ? profile.soilHi : profile.soil],
              [isHindi ? 'सिंचाई और पानी' : 'Irrigation & water', isHindi ? profile.irrigationHi : profile.irrigation],
              [isHindi ? 'भूजल स्थिति' : 'Groundwater', isHindi ? profile.groundwaterHi : profile.groundwater],
              [isHindi ? 'भूमि स्वामित्व' : 'Tenure pattern', isHindi ? profile.tenureHi : profile.tenure],
            ].map(([label, value]) => <div key={label} className="rounded-2xl border border-amber-100 bg-white p-4"><h4 className="text-xs font-black uppercase tracking-wider text-amber-800">{label}</h4><p className="mt-2 text-xs font-semibold leading-relaxed text-gray-700">{value}</p></div>)}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-white p-4"><h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">{isHindi ? 'फसल कैलेंडर' : 'Cropping pattern'}</h4><p className="mt-2 text-xs font-semibold text-gray-700"><strong>Kharif:</strong> {(isHindi ? profile.kharifCropsHi : profile.kharifCrops).join(', ')}<br /><strong>Rabi:</strong> {(isHindi ? profile.rabiCropsHi : profile.rabiCrops).join(', ')}<br /><strong>Zaid:</strong> {(isHindi ? profile.zaidCropsHi : profile.zaidCrops).join(', ')}</p></div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-4"><h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">{isHindi ? 'मुख्य चुनौतियां' : 'Key challenges'}</h4><ul className="mt-2 space-y-1 text-xs font-semibold leading-relaxed text-gray-700">{(isHindi ? profile.challengesHi : profile.challenges).map((challenge) => <li key={challenge}>• {challenge}</li>)}</ul></div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-4"><h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">{isHindi ? 'योजनाएं' : 'Relevant schemes'}</h4><p className="mt-2 text-xs font-semibold leading-relaxed text-gray-700">{(isHindi ? profile.schemesHi : profile.schemes).join(' · ')}</p><p className="mt-2 text-[10px] font-bold text-gray-500">{isHindi ? 'पात्रता और समय सीमा आधिकारिक पोर्टल पर जांचें।' : 'Verify eligibility and deadlines on official portals.'}</p></div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-4"><h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">{isHindi ? 'सहायता ढांचा' : 'Support infrastructure'}</h4><p className="mt-2 text-xs font-semibold leading-relaxed text-gray-700">{isHindi ? profile.kvkHi : profile.kvk}<br />{isHindi ? profile.universityHi : profile.university}</p></div>
          </div>

          <div className="rounded-2xl border border-dashed border-amber-300 bg-white p-4 text-xs font-semibold leading-relaxed text-gray-700"><strong>{isHindi ? 'साक्ष्य स्थिति:' : 'Evidence status:'}</strong> {isHindi ? profile.evidenceHi : profile.evidence}<details className="mt-3"><summary className="cursor-pointer font-black text-amber-800">{isHindi ? 'स्रोत देखें' : 'View sources'}</summary><ul className="mt-2 space-y-1">{profile.sources.map((source) => <li key={source}>• {source}</li>)}</ul></details></div>
        </div>
      )}
    </section>
  );
}

export default StateFarmExplorer;
