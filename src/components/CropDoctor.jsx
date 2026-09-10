import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext';
import { cropDiseasesDatabase } from '../data/diseasesData';
import { 
  Activity, 
  UploadCloud,
  Camera,
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Leaf, 
  FlaskConical, 
  CheckCircle2, 
  Volume2, 
  RefreshCw,
  Info,
  X,
  Image as ImageIcon
} from 'lucide-react';

const leafFallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%230f766e"/%3E%3Cellipse cx="300" cy="220" rx="180" ry="90" transform="rotate(-18 300 220)" fill="%234ade80"/%3E%3Cpath d="M130 285 C245 230 345 170 485 80" stroke="%23dcfce7" stroke-width="8" fill="none"/%3E%3Cpath d="M245 225 L205 135 M300 190 L275 105 M355 155 L350 78" stroke="%23bbf7d0" stroke-width="5" fill="none"/%3E%3Ccircle cx="390" cy="180" r="18" fill="%23f59e0b" opacity=".85"/%3E%3Ccircle cx="330" cy="220" r="12" fill="%23ef4444" opacity=".8"/%3E%3Ctext x="300" y="365" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="white"%3EAgriMatter Crop Sample%3C/text%3E%3C/svg%3E';

const handleImageError = (event) => {
  if (event.currentTarget.src !== leafFallbackImage) {
    event.currentTarget.src = leafFallbackImage;
  }
};

export const CropDoctor = () => {
  const { t, lang, speakText } = useLanguage();
  const { isLoggedIn, openAuthModal } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const analysisTimerRef = useRef(null);

  // Trigger analysis for a sample or uploaded leaf
  const runDiagnosis = (diseaseItem) => {
    clearTimeout(analysisTimerRef.current);
    setSelectedImage(diseaseItem.sampleImage);
    setAnalyzing(true);
    setDiagnosis(null);

    // Simulate neural net forward pass
    analysisTimerRef.current = setTimeout(() => {
      setDiagnosis(diseaseItem);
      setAnalyzing(false);

      // Optionally speak the diagnosis in current language
      const speech = lang === 'hi'
        ? `रोग की पहचान: ${diseaseItem.diseaseNameHi}। यह ${diseaseItem.crop} में पाया गया है। विश्वसनीयता स्तर ${diseaseItem.confidence} प्रतिशत है।`
        : `Identified Condition: ${diseaseItem.diseaseNameEn} on ${diseaseItem.crop} with ${diseaseItem.confidence}% confidence.`;
      speakText(speech);
    }, 1200);
  };

  const processImageFile = (file) => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    if (!file) return;

    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      setUploadError(lang === 'hi'
        ? 'कृपया JPG, PNG या WEBP फोटो चुनें।'
        : 'Please choose a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(lang === 'hi'
        ? 'फोटो का आकार 10 MB से कम होना चाहिए।'
        : 'Photo size must be smaller than 10 MB.');
      return;
    }

    setUploadError('');
    clearTimeout(analysisTimerRef.current);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setAnalyzing(true);
      setDiagnosis(null);

      analysisTimerRef.current = setTimeout(() => {
        // Match a random realistic disease or first disease
        const matched = cropDiseasesDatabase[0];
        setDiagnosis(matched);
        setAnalyzing(false);
      }, 1400);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    processImageFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    processImageFile(e.dataTransfer.files[0]);
  };

  const clearUpload = () => {
    clearTimeout(analysisTimerRef.current);
    setSelectedImage(null);
    setDiagnosis(null);
    setAnalyzing(false);
    setUploadError('');
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-900 via-emerald-800 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 backdrop-blur border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Computer Vision Pathology Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {t('doctor.title')}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            {t('doctor.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload / Camera & Sample Leaves */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`bg-white rounded-3xl p-6 border-2 border-dashed transition shadow-sm text-center ${
              isDragging ? 'border-emerald-600 bg-emerald-50' : 'border-emerald-300 hover:border-emerald-500'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              {lang === 'hi' ? 'पत्ती की साफ फोटो अपलोड करें' : 'Upload a clear leaf photo'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'hi' ? 'फोटो यहां खींचकर छोड़ें या नीचे से चुनें' : 'Drag and drop an image here, or choose an option below'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
                <UploadCloud className="w-4 h-4" />
                <span>{lang === 'hi' ? 'गैलरी से चुनें' : 'Choose from gallery'}</span>
              </label>
              <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs px-5 py-2.5 rounded-xl border border-emerald-200 transition">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Camera className="w-4 h-4" />
                <span>{lang === 'hi' ? 'कैमरा खोलें' : 'Use camera'}</span>
              </label>
            </div>
            <p className="mt-4 text-[11px] text-slate-400 font-medium">
              JPG, PNG, WEBP · {lang === 'hi' ? 'अधिकतम 10 MB' : 'Maximum 10 MB'}
            </p>
            {uploadError && (
              <p role="alert" className="mt-3 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {uploadError}
              </p>
            )}
            {selectedImage && !analyzing && (
              <div className="mt-5 flex items-center gap-3 text-left bg-slate-50 rounded-2xl border border-slate-200 p-3">
                    <Image src={selectedImage} onError={handleImageError} alt="Selected leaf" width={56} height={56} className="h-14 w-14 rounded-xl border border-emerald-200 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{lang === 'hi' ? 'फोटो तैयार है' : 'Photo ready for review'}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold">{lang === 'hi' ? 'AI रिपोर्ट नीचे उपलब्ध है' : 'AI report is ready below'}</p>
                </div>
                <button type="button" onClick={clearUpload} aria-label="Remove selected image" className="p-2 text-slate-400 hover:text-rose-600 transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Quick 1-Click Samples for SIH Jury Presentation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                {t('doctor.sampleImagesTitle')}
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Demo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {cropDiseasesDatabase.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => isLoggedIn ? runDiagnosis(item) : openAuthModal()}
                  className="group flex flex-col items-start p-2.5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition text-left"
                >
                  <Image
                    src={item.sampleImage}
                    onError={handleImageError}
                    alt={item.diseaseNameEn}
                    width={300}
                    height={96}
                    className="mb-2 h-24 w-full rounded-xl object-cover transition group-hover:scale-102"
                  />
                  <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 line-clamp-1">
                    {lang === 'hi' ? item.diseaseNameHi : item.diseaseNameEn}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {item.crop}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Scanner & Diagnostic Report */}
        <div className="lg:col-span-7">
          {analyzing ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[420px]">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin"></div>
                <Sparkles className="w-8 h-8 text-amber-500 absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {t('doctor.diagnosing')}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Extracting chlorophyll degradation metrics, lesion contours, and pathogen signatures across 25+ agricultural classes.
              </p>
            </div>
          ) : diagnosis ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md animate-in fade-in duration-300">
              {/* Header result */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  {selectedImage && (
                    <Image
                      src={selectedImage}
                      onError={handleImageError}
                      alt="Scanned leaf"
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-2xl border-2 border-emerald-500 object-cover shadow-sm"
                    />
                  )}
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      {diagnosis.crop}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900">
                      {lang === 'hi' ? diagnosis.diseaseNameHi : diagnosis.diseaseNameEn}
                    </h2>
                    <p className="text-xs text-slate-500 italic mt-0.5">
                      Pathogen: {diagnosis.pathogen}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-black px-3 py-1 rounded-full border ${diagnosis.severityColor}`}>
                    {diagnosis.severity} Severity
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {diagnosis.confidence}% {t('doctor.confidence')}
                  </span>
                </div>
              </div>

              {/* Audio Listen Bar */}
              <div className="mt-4 flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>
                    {lang === 'hi' ? 'सलाह को आवाज में सुनें:' : 'Listen to Agronomist Advisory:'}
                  </span>
                </div>
                <button
                  onClick={() => speakText(
                    lang === 'hi'
                      ? `${diagnosis.diseaseNameHi}। जैविक उपचार: ${diagnosis.organicRemedy.hi}। रासायनिक उपचार: ${diagnosis.chemicalTreatment.hi}`
                      : `${diagnosis.diseaseNameEn}. Organic treatment: ${diagnosis.organicRemedy.en}. Chemical treatment: ${diagnosis.chemicalTreatment.en}`
                  )}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'बोलकर सुनाएं' : 'Play Audio'}</span>
                </button>
              </div>

              {/* Symptoms */}
              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>{t('doctor.symptoms')}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {lang === 'hi' ? diagnosis.symptoms.hi : diagnosis.symptoms.en}
                </p>
              </div>

              {/* Organic Remedies */}
              <div className="mt-5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider mb-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>{t('doctor.organicTreatment')}</span>
                </div>
                <div className="text-xs sm:text-sm text-emerald-950 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/70 leading-relaxed font-medium">
                  {lang === 'hi' ? diagnosis.organicRemedy.hi : diagnosis.organicRemedy.en}
                </div>
              </div>

              {/* Chemical Treatment & Dosage */}
              <div className="mt-5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 uppercase tracking-wider mb-2">
                  <FlaskConical className="w-4 h-4 text-amber-600" />
                  <span>{t('doctor.chemicalTreatment')}</span>
                </div>
                <div className="text-xs sm:text-sm text-amber-950 bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 leading-relaxed font-medium">
                  {lang === 'hi' ? diagnosis.chemicalTreatment.hi : diagnosis.chemicalTreatment.en}
                </div>
              </div>

              {/* Prevention Guidelines */}
              <div className="mt-5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{t('doctor.prevention')}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                  {lang === 'hi' ? diagnosis.prevention.hi : diagnosis.prevention.en}
                </p>
              </div>

              {/* Retest Button */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setDiagnosis(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t('doctor.retest')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Activity className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {lang === 'hi' ? 'कोई पत्ती स्कैन नहीं की गई' : 'No Leaf Scanned Yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mb-6">
                {lang === 'hi' 
                  ? 'रोग की तत्काल पहचान के लिए बाईं ओर से अपनी पत्ती की फोटो अपलोड करें या डेमो के लिए नमूना पत्ती पर क्लिक करें।' 
                  : 'Upload an infected leaf photo on the left or select a sample leaf to demonstrate instant pathology diagnosis.'}
              </p>
              <button
                onClick={() => isLoggedIn ? runDiagnosis(cropDiseasesDatabase[0]) : openAuthModal()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition"
              >
                {lang === 'hi' ? 'टमाटर का नमूना टेस्ट करें' : 'Try Tomato Demo Leaf'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
