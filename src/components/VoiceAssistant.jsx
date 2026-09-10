import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  X, 
  Sparkles, 
  MessageSquare, 
  HelpCircle 
} from 'lucide-react';

export const VoiceAssistant = ({ isOpen, onClose, setActiveTab }) => {
  const { lang, t, speakText } = useLanguage();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');

  // Sample prompt queries for 1-click test
  const sampleVoiceQueries = [
    { textEn: "Show nearby farmers and tractors", textHi: "आस-पास के किसान और ट्रैक्टर दिखाएं", tab: 'nearby', replyEn: "Opening Kisan Samuday nearby farmers and machinery directory.", replyHi: "निकटवर्ती किसान समुदाय एवं किराए के ट्रैक्टर की सूची खोल रहा हूँ।" },
    { textEn: "Check late blight disease in tomato", textHi: "टमाटर में झुलसा रोग की जांच करें", tab: 'doctor', replyEn: "Opening AI Crop Doctor for leaf diagnosis and treatment.", replyHi: "रोग जांच के लिए एआई क्रॉप डॉक्टर खोल रहा हूँ।" },
    { textEn: "What is today's wheat mandi price?", textHi: "आज का गेहूँ मंडी भाव क्या है?", tab: 'mandi', replyEn: "Displaying latest APMC Mandi rates and MSP comparison.", replyHi: "मंडी भाव और न्यूनतम समर्थन मूल्य (MSP) खोल रहा हूँ।" },
    { textEn: "Rain forecast for this week", textHi: "इस हफ्ते बारिश का क्या अनुमान है?", tab: 'weather', replyEn: "Showing 7-day weather outlook and agro-advisories.", replyHi: "मौसम पूर्वानुमान और कृषि चेतावनी दिखा रहा हूँ।" },
    { textEn: "How to apply for PM-KISAN ₹6,000?", textHi: "पीएम किसान योजना का लाभ कैसे लें?", tab: 'schemes', replyEn: "Opening Government Schemes and eligibility matcher.", replyHi: "सरकारी योजनाएं और पात्रता जांच खोल रहा हूँ।" }
  ];

  // Process a text intent
  const handleQuery = (queryText, targetTab, replyEn, replyHi) => {
    setTranscript(queryText);
    const reply = lang === 'hi' ? replyHi : replyEn;
    setAiReply(reply);
    speakText(reply);

    if (targetTab) {
      setTimeout(() => {
        setActiveTab(targetTab);
        onClose();
      }, 1500);
    }
  };

  // Web Speech Recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'hi' 
        ? "आपके ब्राउज़र में आवाज़ पहचान (Web Speech API) समर्थित नहीं है। नीचे दिए गए सुझाए गए प्रश्नों पर क्लिक करके टेस्ट करें।" 
        : "Web Speech API is not supported in this browser. Please click on any suggested voice prompt below to test.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
        setAiReply('');
      };

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.toLowerCase();
        setTranscript(spoken);
        setListening(false);

        // Pattern matching
        if (spoken.includes('किसान') || spoken.includes('farmer') || spoken.includes('tractor')) {
          handleQuery(spoken, 'nearby', "Opening nearby farmers directory.", "निकटवर्ती किसान समुदाय खोल रहा हूँ।");
        } else if (spoken.includes('रोग') || spoken.includes('doctor') || spoken.includes('leaf') || spoken.includes('पत्ती')) {
          handleQuery(spoken, 'doctor', "Opening AI Crop Doctor.", "एआई फसल डॉक्टर खोल रहा हूँ।");
        } else if (spoken.includes('भाव') || spoken.includes('mandi') || spoken.includes('rate') || spoken.includes('गेहूँ')) {
          handleQuery(spoken, 'mandi', "Opening live Mandi prices.", "मंडी भाव खोल रहा हूँ।");
        } else if (spoken.includes('बाज़ार') || spoken.includes('market') || spoken.includes('sell') || spoken.includes('बेच')) {
          handleQuery(spoken, 'market', "Opening Agri Bazaar.", "किसान बाज़ार खोल रहा हूँ।");
        } else if (spoken.includes('मौसम') || spoken.includes('weather') || spoken.includes('rain') || spoken.includes('बारिश')) {
          handleQuery(spoken, 'weather', "Opening Weather Advisory.", "मौसम पूर्वानुमान खोल रहा हूँ।");
        } else if (spoken.includes('योजना') || spoken.includes('scheme') || spoken.includes('subsidy')) {
          handleQuery(spoken, 'schemes', "Opening Government Schemes.", "सरकारी योजनाएं खोल रहा हूँ।");
        } else if (spoken.includes('खाद') || spoken.includes('fertilizer') || spoken.includes('यूरिया')) {
          handleQuery(spoken, 'fertilizer', "Opening Fertilizer Calculator.", "उर्वरक कैलकुलेटर खोल रहा हूँ।");
        } else {
          const fallback = lang === 'hi' 
            ? "मुझे समझ आया। कृपया नीचे दिए गए विकल्पों में से चुनें।" 
            : "I heard you. Please select a feature below.";
          setAiReply(fallback);
          speakText(fallback);
        }
      };

      recognition.onerror = () => {
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } catch (err) {
      setListening(false);
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-150 border border-white/20">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500" />
        <div className="p-6 sm:p-8">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close voice assistant"
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-full text-[11px] font-extrabold mb-4 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Krishi Mitra <span className="text-amber-400 mx-1">•</span> Voice Assistant</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-slate-900">
            {lang === 'hi' ? 'अपनी भाषा में बोलें' : 'Speak to AgriMatter'}
          </h3>
          <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
            {lang === 'hi' ? 'हिंदी या अंग्रेजी में प्रश्न पूछें' : 'Ask in Hindi or English hands-free'}
          </p>
        </div>

        {/* Animated Mic Button */}
        <div className="flex flex-col items-center justify-center mb-7">
          <button
            type="button"
            onClick={startListening}
            aria-label={listening ? 'Listening' : 'Start voice input'}
            className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
              listening 
                ? 'bg-rose-500 text-white ring-8 ring-rose-100' 
                : 'bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:scale-105'
            }`}
          >
            <span className={`absolute inset-0 rounded-full border-2 border-white/40 ${listening ? 'animate-ping' : ''}`} />
            <Mic className="w-10 h-10" />
            {listening && (
              <span className="absolute -bottom-8 text-[11px] font-black text-rose-600 tracking-widest uppercase">Listening...</span>
            )}
          </button>
          {!listening && (
            <span className="text-xs font-bold text-slate-500 mt-5">
              {lang === 'hi' ? 'माइक पर टैप करके बोलें' : 'Tap to start speaking'}
            </span>
          )}
          <div className="h-5 flex items-end justify-center gap-1 mt-4" aria-hidden="true">
            {[10, 16, 24, 14, 20, 12, 18].map((height, index) => (
              <span
                key={index}
                className={`w-1 rounded-full bg-gradient-to-t from-amber-500 to-orange-400 ${listening ? 'animate-pulse' : 'opacity-40'}`}
                style={{ height: `${height}px`, animationDelay: `${index * 80}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Transcript & AI Response */}
        {(transcript || aiReply) && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs mb-6 space-y-3">
            {transcript && (
              <div className="bg-white rounded-xl p-3 border border-slate-200">
                <span className="text-slate-400 font-extrabold block text-[10px] uppercase tracking-wider mb-1">
                  You Said:
                </span>
                <p className="font-semibold text-slate-800 italic">{transcript}</p>
              </div>
            )}
            {aiReply && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                <span className="text-emerald-700 font-extrabold block text-[10px] uppercase tracking-wider mb-1">
                  AgriMatter AI:
                </span>
                <p className="font-bold text-emerald-950 leading-relaxed">{aiReply}</p>
              </div>
            )}
          </div>
        )}

        {/* 1-Click Sample Questions (Essential for SIH Judges Demonstration) */}
        <div>
          <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-3">
            {lang === 'hi' ? 'सुझाए गए प्रश्न (1-क्लिक टेस्ट):' : 'Or Click a Voice Query to Test:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
            {sampleVoiceQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuery(
                  lang === 'hi' ? q.textHi : q.textEn,
                  q.tab,
                  q.replyEn,
                  q.replyHi
                )}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/70 hover:-translate-y-0.5 text-xs text-slate-700 font-semibold transition-all flex items-center justify-between group"
              >
                <span className="group-hover:text-amber-900 truncate">
                  {lang === 'hi' ? q.textHi : q.textEn}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-2 opacity-60 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
