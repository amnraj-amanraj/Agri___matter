import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { initialFarmersData } from '../data/nearbyFarmersData';
import confetti from 'canvas-confetti';
import { 
  Users, 
  MapPin, 
  Wrench, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Star, 
  Sliders, 
  PlusCircle, 
  X, 
  Layers, 
  ShieldCheck, 
  Calendar,
  Volume2
} from 'lucide-react';

export const NearbyFarmers = () => {
  const { t, lang, speakText } = useLanguage();
  const [farmers, setFarmers] = useState(initialFarmersData);
  const [maxDistance, setMaxDistance] = useState(35);
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);

  // New Farmer Form State
  const [newFarmer, setNewFarmer] = useState({
    name: '',
    village: '',
    district: '',
    state: 'Punjab',
    phone: '',
    whatsapp: '',
    landSizeAcres: '',
    soilType: 'Alluvial Loam',
    crops: '',
    specialization: 'Natural Farming',
    equipmentName: '',
    equipmentRate: '',
    bio: ''
  });

  // Unique machinery types for filter
  const machineryTypes = [
    'All',
    'Tractor',
    'Drone',
    'Leveler',
    'Sprayer',
    'Harvester / Thresher',
    'Tiller'
  ];

  // Unique crops for filter
  const cropList = ['All', 'Wheat', 'Paddy', 'Soybean', 'Tomato', 'Mustard', 'Cotton', 'Onion'];

  // Filtered farmers
  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      // Distance filter
      if (farmer.distanceKm > maxDistance) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = farmer.name.toLowerCase().includes(query);
        const matchesVillage = farmer.village.toLowerCase().includes(query);
        const matchesDistrict = farmer.district.toLowerCase().includes(query);
        const matchesCrop = farmer.crops.some(c => c.toLowerCase().includes(query));
        if (!matchesName && !matchesVillage && !matchesDistrict && !matchesCrop) return false;
      }

      // Equipment filter
      if (selectedEquipment !== 'All') {
        const hasEquipment = farmer.equipmentForRent.some(eq => {
          const eqText = eq.name.toLowerCase();
          const target = selectedEquipment.toLowerCase();
          if (target.includes('tractor')) return eqText.includes('tractor') || eqText.includes('hp');
          if (target.includes('drone')) return eqText.includes('drone');
          if (target.includes('leveler')) return eqText.includes('leveler');
          if (target.includes('sprayer')) return eqText.includes('sprayer') || eqText.includes('pump');
          if (target.includes('harvester') || target.includes('thresher')) return eqText.includes('thresher') || eqText.includes('seeder') || eqText.includes('harvester');
          if (target.includes('tiller')) return eqText.includes('tiller') || eqText.includes('rotavator');
          return eqText.includes(target);
        });
        if (!hasEquipment) return false;
      }

      // Crop filter
      if (selectedCrop !== 'All') {
        const hasCrop = farmer.crops.some(c => c.toLowerCase().includes(selectedCrop.toLowerCase()));
        if (!hasCrop) return false;
      }

      return true;
    });
  }, [farmers, maxDistance, selectedEquipment, selectedCrop, searchQuery]);

  // Handle form submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!newFarmer.name || !newFarmer.phone || !newFarmer.village) {
      alert("Please fill in required fields (Name, Phone, Village).");
      return;
    }

    const createdFarmer = {
      id: `farmer-${Date.now()}`,
      name: newFarmer.name,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      village: newFarmer.village,
      district: newFarmer.district || "Local District",
      state: newFarmer.state,
      distanceKm: 2.0, // user is local
      phone: newFarmer.phone,
      whatsapp: newFarmer.whatsapp || newFarmer.phone.replace(/[^0-9]/g, ''),
      verified: true,
      fpoMember: "Community Registered",
      rating: 5.0,
      reviewsCount: 1,
      landSizeAcres: parseFloat(newFarmer.landSizeAcres) || 4.0,
      soilType: newFarmer.soilType,
      crops: newFarmer.crops ? newFarmer.crops.split(',').map(s => s.trim()) : ["Wheat", "Vegetables"],
      specialization: newFarmer.specialization || "Mixed Crop Farming",
      equipmentForRent: newFarmer.equipmentName ? [
        {
          id: `eq-${Date.now()}`,
          name: newFarmer.equipmentName,
          ratePerHour: parseInt(newFarmer.equipmentRate) || 400,
          ratePerDay: (parseInt(newFarmer.equipmentRate) || 400) * 8,
          status: "Available"
        }
      ] : [],
      experienceYears: 10,
      bio: newFarmer.bio || "Active local farmer looking to collaborate with neighbors."
    };

    setFarmers([createdFarmer, ...farmers]);
    setIsRegisterOpen(false);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // fallback
    }

    alert(lang === 'hi' ? "आपकी प्रोफाइल और उपकरण सफलतापूर्वक दर्ज हो गए हैं!" : "Your farmer profile and equipment have been listed successfully!");
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 backdrop-blur border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 mb-4">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Kisan Samuday • Nearby Farmers Network</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {t('nearby.title')}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">
            {t('nearby.subtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-400/20 transition hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('nearby.joinCommunity')}</span>
            </button>

            <button
              onClick={() => speakText(
                lang === 'hi' 
                  ? "किसान समुदाय में आपका स्वागत है। यहां आप अपने 50 किलोमीटर के दायरे में साथी किसानों की जानकारी, बोई गई फसलें और किराए पर उपलब्ध ट्रैक्टर या कृषि ड्रोन देख सकते हैं।" 
                  : "Welcome to Kisan Samuday. Discover nearby farmers within 50 kilometers, their crop patterns, and available machinery for rent such as tractors and drones."
              )}
              className="flex items-center gap-2 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-100 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
            >
              <Volume2 className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'hi' ? 'ऑडियो में सुनें' : 'Listen Overview'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="mt-8 pt-6 border-t border-emerald-600/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-emerald-900/40 rounded-xl p-3 border border-emerald-500/20">
            <div className="text-2xl font-black text-white">{farmers.length}</div>
            <div className="text-xs text-emerald-200">{lang === 'hi' ? 'सक्रिय किसान' : 'Active Farmers'}</div>
          </div>
          <div className="bg-emerald-900/40 rounded-xl p-3 border border-emerald-500/20">
            <div className="text-2xl font-black text-amber-300">
              {farmers.reduce((acc, f) => acc + f.equipmentForRent.length, 0)}
            </div>
            <div className="text-xs text-emerald-200">{lang === 'hi' ? 'किराए हेतु मशीनें' : 'Machines for Rent'}</div>
          </div>
          <div className="bg-emerald-900/40 rounded-xl p-3 border border-emerald-500/20">
            <div className="text-2xl font-black text-emerald-300">₹400-950</div>
            <div className="text-xs text-emerald-200">{lang === 'hi' ? 'औसत प्रति घंटा दर' : 'Avg Rental / Hr'}</div>
          </div>
          <div className="bg-emerald-900/40 rounded-xl p-3 border border-emerald-500/20">
            <div className="text-2xl font-black text-white">0%</div>
            <div className="text-xs text-emerald-200">{lang === 'hi' ? 'बिचौलिया शुल्क' : 'Middleman Fee'}</div>
          </div>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {lang === 'hi' ? 'नाम, गाँव या फसल से खोजें' : 'Search by Name, Village, or Crop'}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'उदा. बलदेव सिंह, रामपुर, गेहूँ...' : 'e.g. Baldev, Rampur, Wheat...'}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Distance Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('nearby.filterRadius')}
              </label>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {maxDistance} km
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Farm Machinery Needed Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('nearby.filterEquipment')}
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {machineryTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? t('nearby.allMachinery') : type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Crop Badges */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">
            {t('nearby.filterCrop')}:
          </span>
          {cropList.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCrop === crop
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {crop === 'All' ? t('nearby.allCrops') : crop}
            </button>
          ))}
        </div>
      </div>

      {/* Farmers Grid */}
      {filteredFarmers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            {lang === 'hi' ? 'कोई किसान नहीं मिला' : 'No Farmers Found in this Radius'}
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {lang === 'hi' 
              ? 'कृपया दूरी का दायरा बढ़ाएं या अन्य उपकरण फिल्टर हटाकर देखें।' 
              : 'Try expanding the distance radius slider or clearing equipment filters.'}
          </p>
          <button
            onClick={() => {
              setMaxDistance(50);
              setSelectedEquipment('All');
              setSelectedCrop('All');
              setSearchQuery('');
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
          >
            {lang === 'hi' ? 'सभी फिल्टर रीसेट करें' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <div
              key={farmer.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group hover:border-emerald-300"
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={farmer.avatar}
                      alt={farmer.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full border-2 border-emerald-500 object-cover shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition">
                          {farmer.name}
                        </h3>
                        {farmer.verified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" title={t('nearby.verifiedFarmer')} />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{farmer.village}, {farmer.district}</span>
                      </div>
                    </div>
                  </div>

                  {/* Distance Badge */}
                  <span className="shrink-0 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {farmer.distanceKm} km
                  </span>
                </div>

                {/* Farm Specs: Land & Rating */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs mb-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t('nearby.landSize')}</span>
                    <span className="font-bold text-slate-800">
                      {farmer.landSizeAcres} {t('nearby.acres')} ({farmer.soilType})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">FPO / Trust</span>
                    <span className="font-semibold text-emerald-700 truncate block" title={farmer.fpoMember}>
                      {farmer.fpoMember}
                    </span>
                  </div>
                </div>

                {/* Crops Grown */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    {t('nearby.cropsGrown')}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {farmer.crops.map((crop, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-50 text-emerald-900 border border-emerald-200/60 text-xs font-medium px-2 py-0.5 rounded-md"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Equipment for Rent */}
                {farmer.equipmentForRent.length > 0 && (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-amber-700" />
                        <span>{t('nearby.availableTools')}</span>
                      </div>
                      <span className="text-[10px] text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded">
                        {farmer.equipmentForRent.length} Listed
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {farmer.equipmentForRent.map((eq) => (
                        <div key={eq.id} className="flex items-center justify-between text-xs">
                          <span className="text-slate-800 font-medium truncate max-w-[180px]" title={eq.name}>
                            • {eq.name}
                          </span>
                          <span className="font-black text-amber-900 shrink-0">
                            ₹{eq.ratePerHour}{t('nearby.ratePerHour')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialization Tag */}
                <div className="text-xs text-slate-600 italic">
                  <span className="font-semibold not-italic text-slate-700">
                    {t('nearby.specialization')}:
                  </span> {farmer.specialization}
                </div>
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                {/* WhatsApp Link */}
                <a
                  href={`https://wa.me/${farmer.whatsapp}?text=Namaste%20${encodeURIComponent(farmer.name)},%20I%20saw%20your%20profile%20on%20AgriMatter%20Kisan%20Samuday.%20I%20would%20like%20to%20connect%20with%20you.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t('nearby.connectWhatsApp')}</span>
                </a>

                {/* Call Button */}
                <a
                  href={`tel:${farmer.phone}`}
                  className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition"
                  title="Direct Call"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('nearby.callFarmer')}</span>
                </a>

                {/* Detail Modal Trigger */}
                <button
                  onClick={() => setActiveProfile(farmer)}
                  className="px-2.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition"
                  title="Full Profile"
                >
                  Info
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile Detail Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveProfile(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <Image
                src={activeProfile.avatar}
                alt={activeProfile.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full border-2 border-emerald-500 object-cover shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{activeProfile.name}</h3>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500">
                  {activeProfile.village}, {activeProfile.district}, {activeProfile.state} ({activeProfile.distanceKm} km away)
                </p>
                <p className="text-xs font-bold text-emerald-700 mt-1">
                  {activeProfile.fpoMember}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">Farmer Experience & Philosophy:</span>
                <p className="leading-relaxed text-slate-600">{activeProfile.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-900 block">Cultivated Land:</span>
                  <p className="text-sm font-black text-emerald-700">
                    {activeProfile.landSizeAcres} Acres
                  </p>
                  <span className="text-[11px] text-emerald-600">{activeProfile.soilType}</span>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <span className="font-bold text-amber-900 block">Experience:</span>
                  <p className="text-sm font-black text-amber-700">
                    {activeProfile.experienceYears} Years in Farming
                  </p>
                  <span className="text-[11px] text-amber-600">Rated {activeProfile.rating} ★ ({activeProfile.reviewsCount} reviews)</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Equipment Available for Co-op Rent:</span>
                <div className="space-y-2">
                  {activeProfile.equipmentForRent.map((eq) => (
                    <div key={eq.id} className="flex justify-between items-center bg-slate-100 p-2 rounded-lg">
                      <span className="font-semibold text-slate-800">{eq.name}</span>
                      <div className="text-right">
                        <span className="font-black text-emerald-700">₹{eq.ratePerHour}/hr</span>
                        <span className="text-[10px] text-slate-500 block">(₹{eq.ratePerDay}/day)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={`https://wa.me/${activeProfile.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
              <a
                href={`tel:${activeProfile.phone}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Call</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Register Farmer Profile & Tools Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                SIH Cooperative Module
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                {t('nearby.modalTitle')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                List your farm profile and rent out machinery to neighboring farmers during idle hours to earn extra income.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('nearby.fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={newFarmer.name}
                  onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                  placeholder="e.g. Gurpreet Singh / Suresh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Village / Block *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFarmer.village}
                    onChange={(e) => setNewFarmer({ ...newFarmer, village: e.target.value })}
                    placeholder="e.g. Rampur"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={newFarmer.district}
                    onChange={(e) => setNewFarmer({ ...newFarmer, district: e.target.value })}
                    placeholder="e.g. Ludhiana / Indore"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('nearby.phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newFarmer.phone}
                    onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('nearby.landSize')}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newFarmer.landSizeAcres}
                    onChange={(e) => setNewFarmer({ ...newFarmer, landSizeAcres: e.target.value })}
                    placeholder="e.g. 5"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('nearby.cropsPlanted')}
                </label>
                <input
                  type="text"
                  value={newFarmer.crops}
                  onChange={(e) => setNewFarmer({ ...newFarmer, crops: e.target.value })}
                  placeholder="e.g. Wheat, Mustard, Green Peas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-2">
                  🚜 List Farm Machinery for Rental Income (Optional):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={newFarmer.equipmentName}
                      onChange={(e) => setNewFarmer({ ...newFarmer, equipmentName: e.target.value })}
                      placeholder="Machine name (e.g. Swaraj 50HP Tractor)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={newFarmer.equipmentRate}
                      onChange={(e) => setNewFarmer({ ...newFarmer, equipmentRate: e.target.value })}
                      placeholder="Rate ₹/hr"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Short Bio / Specialization
                </label>
                <textarea
                  rows="2"
                  value={newFarmer.bio}
                  onChange={(e) => setNewFarmer({ ...newFarmer, bio: e.target.value })}
                  placeholder="e.g. Certified organic grower, available for custom tractor hire and laser leveling."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition"
                >
                  {t('nearby.submitProfile')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
