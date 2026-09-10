'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bot, Mic, MicOff, Send, Sparkles, User, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function AIAssistantPage() {
  const { t, language } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const recognitionRef = useRef<any>(null);

  const suggestedQuestions = language === 'hi' ? [
    "गेहूँ में पीला रतुआ का इलाज क्या है?",
    "धान की फसल में कीट नियंत्रण कैसे करें?",
    "यूरिया डालने का सही समय और तरीका?",
    "कल मौसम कैसा रहेगा, स्प्रे करें या नहीं?"
  ] : [
    "How to treat yellow rust in wheat?",
    "What is the best pest control for rice crop?",
    "When is the ideal time for urea top dressing?",
    "Is it safe to spray pesticides tomorrow?"
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: language === 'hi'
        ? "नमस्ते! मैं आपका एग्रीमैटर किसान सहायक हूँ। आप हिंदी या अंग्रेजी में खेती, मौसम या बीमारी से जुड़ा कोई भी सवाल पूछ सकते हैं।"
        : "Namaste! I am your Agrimatter Kisan AI Assistant. Ask any question regarding crops, weather, soil, or pest control.",
      timestamp: '--:--'
    }
  ]);

  useEffect(() => {
    setMessages((prev) => prev.map((message) => (
      message.id === '1' && message.timestamp === '--:--'
        ? { ...message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        : message
    )));
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    setIsGenerating(true);
    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, language })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to get an assistant response');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.answer);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: language === 'hi'
          ? 'अभी AI उत्तर उपलब्ध नहीं है। कृपया थोड़ी देर बाद दोबारा प्रयास करें।'
          : 'The AI answer is temporarily unavailable. Please try again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognitionConstructor = typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

    if (!recognitionConstructor) {
      setInputQuery(language === 'hi'
        ? 'इस ब्राउज़र में voice input उपलब्ध नहीं है। कृपया अपना सवाल लिखें।'
        : 'Voice input is not supported in this browser. Please type your question.');
      return;
    }

    const recognition = new recognitionConstructor();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const spokenQuery = event.results?.[0]?.[0]?.transcript?.trim();
      setIsListening(false);
      if (spokenQuery) {
        setInputQuery(spokenQuery);
        void handleSend(spokenQuery);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-4 py-2">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-agri-green-900 flex items-center space-x-2">
            <Bot className="w-8 h-8 text-agri-green-700" />
            <span>{t.aiPage.title}</span>
          </h1>
          <p className="text-xs font-semibold text-gray-600">
            {t.aiPage.subtitle}
          </p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-2">
        <span className="text-xs font-extrabold text-agri-green-900">{t.aiPage.suggestedQueries}</span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="text-xs font-bold text-agri-green-900 bg-emerald-100/70 hover:bg-agri-green-700 hover:text-white px-3 py-1.5 rounded-full transition border border-emerald-200 text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <Card className="h-[420px] flex flex-col justify-between p-4 bg-gray-50/70 border-emerald-200">
        
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-agri-green-700 text-white flex items-center justify-center font-bold flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm font-semibold space-y-1 shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-agri-green-700 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-emerald-100 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                <span className={`text-[10px] block text-right font-normal ${m.sender === 'user' ? 'text-emerald-200' : 'text-gray-400'}`}>
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-agri-brown-700 text-white flex items-center justify-center font-bold flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Listening Overlay */}
        {isListening && (
          <div className="bg-amber-100 text-amber-900 p-2.5 rounded-xl text-xs font-bold text-center animate-pulse mb-2 border border-amber-300">
            🎙️ {t.aiPage.listening}
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-3 border-t border-gray-200 flex items-center space-x-2">
          
          {/* Voice Microphone Button UI */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-3 rounded-xl font-bold transition flex-shrink-0 ${
              isListening
                ? 'bg-red-600 text-white animate-bounce'
                : 'bg-emerald-100 text-agri-green-900 hover:bg-emerald-200'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.aiPage.placeholder}
            className="flex-1 p-3 rounded-xl border border-gray-300 font-bold text-xs sm:text-sm focus:ring-2 focus:ring-agri-green-600 bg-white"
          />

          <Button onClick={() => handleSend()} size="md" className="px-4">
            {isGenerating ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
          </Button>

        </div>

      </Card>

    </div>
  );
}
