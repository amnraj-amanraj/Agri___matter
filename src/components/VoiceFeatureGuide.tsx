'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Check, Mic, Square, Volume2 } from 'lucide-react';

type VoiceFeatureGuideProps = {
  language: 'en' | 'hi';
};

type GuideItem = {
  title: string;
  description: string;
  details: string;
};

const guideContent: Record<'en' | 'hi', { title: string; subtitle: string; listenAll: string; stop: string; listening: string; items: GuideItem[] }> = {
  en: {
    title: 'Hear what every option does',
    subtitle: 'Tap the speaker to learn which page to open and what you can do inside it.',
    listenAll: 'Listen to full guide',
    stop: 'Stop reading',
    listening: 'Reading aloud',
    items: [
      { title: 'Dashboard', description: 'Your farm at a glance.', details: 'See weather alerts, active crop status, soil health, and your next farming action.' },
      { title: 'Weather', description: 'Plan field work around the forecast.', details: 'Check hourly and seven-day weather, rain chance, temperature, wind, and farming advice.' },
      { title: 'Mandi Prices', description: 'Check official market rates.', details: 'Choose state, district, and crop to compare nearby mandi prices before selling.' },
      { title: 'Crop Advisor', description: 'Find a suitable crop.', details: 'Select season, soil, water, and field conditions to get crop suitability recommendations.' },
      { title: 'Soil Health', description: 'Understand your soil.', details: 'Enter pH and NPK values to receive a soil diagnosis and improvement guidance.' },
      { title: 'Fertilizer Guide', description: 'Use fertilizer at the right stage.', details: 'Select your crop and growth stage to see general basal and top-dressing advice.' },
      { title: 'AI Assistant', description: 'Ask questions by voice or text.', details: 'Ask farming questions in Hindi or English and get practical guidance.' },
      { title: 'Farm Setup', description: 'Save your farm details once.', details: 'Choose language, state, district, village, land size, irrigation, soil type, and crop stage.' },
      { title: 'Farm Plan', description: 'Organize your crop activities.', details: 'Review your farming plan and keep important crop tasks in one place.' },
      { title: 'Crop Doctor', description: 'Check crop and leaf problems.', details: 'Use the crop diagnosis flow to identify common diseases and view suggested care.' },
      { title: 'Profile', description: 'Update your personal details.', details: 'Manage your name, location, language, and saved farmer information.' },
    ],
  },
  hi: {
    title: 'हर option का काम सुनकर समझें',
    subtitle: 'Speaker पर tap करके जानें कि कौन सा page कब खोलना है और उसके अंदर क्या मिलेगा।',
    listenAll: 'पूरी जानकारी सुनें',
    stop: 'पढ़ना रोकें',
    listening: 'जानकारी पढ़ी जा रही है',
    items: [
      { title: 'Dashboard', description: 'अपने खेत की पूरी जानकारी एक जगह देखें।', details: 'मौसम alert, active crop, मिट्टी की सेहत और अगला farming action देखें।' },
      { title: 'Weather', description: 'मौसम देखकर खेत का काम तय करें।', details: 'Hourly और सात दिन का forecast, बारिश की संभावना, तापमान, हवा और farming advice देखें।' },
      { title: 'Mandi Prices', description: 'बिक्री से पहले मंडी भाव देखें।', details: 'State, district और crop चुनकर आसपास की मंडियों के official prices compare करें।' },
      { title: 'Crop Advisor', description: 'अपने खेत के लिए सही फसल खोजें।', details: 'Season, मिट्टी, पानी और field conditions चुनकर crop recommendation पाएं।' },
      { title: 'Soil Health', description: 'अपनी मिट्टी को समझें।', details: 'pH और NPK values डालकर soil diagnosis और सुधार की सलाह पाएं।' },
      { title: 'Fertilizer Guide', description: 'सही stage पर सही fertilizer दें।', details: 'Crop और growth stage चुनकर basal और top-dressing की general advice देखें।' },
      { title: 'AI Assistant', description: 'आवाज या text से सवाल पूछें।', details: 'हिंदी या English में खेती से जुड़े सवाल पूछकर practical guidance पाएं।' },
      { title: 'Farm Setup', description: 'अपने खेत की details एक बार save करें।', details: 'Language, state, district, village, land size, irrigation, soil type और crop stage चुनें।' },
      { title: 'Farm Plan', description: 'खेती के काम व्यवस्थित करें।', details: 'अपना farming plan देखें और crop के जरूरी tasks एक जगह रखें।' },
      { title: 'Crop Doctor', description: 'फसल और पत्तियों की समस्या जांचें।', details: 'Crop diagnosis से common diseases पहचानें और देखभाल की suggested advice पाएं।' },
      { title: 'Profile', description: 'अपनी personal details बदलें।', details: 'नाम, location, language और saved farmer information manage करें।' },
    ],
  },
};

export function VoiceFeatureGuide({ language }: VoiceFeatureGuideProps) {
  const content = guideContent[language];
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const speakAll = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    speak(`${content.title}. ${content.items.map((item) => `${item.title}. ${item.description} ${item.details}`).join(' ')}`);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-emerald-50 shadow-lg">
      <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-amber-900">
            <BookOpen className="h-4 w-4 text-amber-600" />
            <span>{language === 'hi' ? 'नया किसान guide' : 'New farmer guide'}</span>
          </div>
          <h2 className="text-2xl font-black text-agri-green-900">{content.title}</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-gray-600">{content.subtitle}</p>
          <button
            type="button"
            onClick={speakAll}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-agri-green-700 px-4 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-agri-green-800"
          >
            {speaking ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            <span>{speaking ? content.stop : content.listenAll}</span>
          </button>
          {speaking && <p className="mt-2 text-xs font-bold text-emerald-700">{content.listening}</p>}
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-2 lg:max-w-2xl">
          {content.items.map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white/80 p-3">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-agri-green-900">{item.title}</p>
                <p className="mt-0.5 text-xs font-semibold leading-relaxed text-gray-600">{item.description}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500">{item.details}</p>
              </div>
              <button
                type="button"
                onClick={() => speak(`${item.title}. ${item.description} ${item.details}`)}
                aria-label={`${language === 'hi' ? 'सुनें' : 'Listen'}: ${item.title}`}
                title={language === 'hi' ? 'इस option की जानकारी सुनें' : 'Listen to this option'}
                className="rounded-lg p-2 text-amber-700 transition hover:bg-amber-100"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}