import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';
import { initialMarketplaceListings } from '../data/marketplaceData';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  PlusCircle, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  X, 
  BadgePercent,
  Sparkles
} from 'lucide-react';

export const KisanBazaar = () => {
  const { t, lang } = useLanguage();
  const [listings, setListings] = useState(initialMarketplaceListings);
  const [category, setCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New listing state
  const [newCrop, setNewCrop] = useState({
    cropName: '',
    category: 'grains',
    variety: '',
    quantity: '',
    pricePerQuintal: '',
    farmerName: '',
    village: '',
    district: '',
    phone: '',
    harvestDate: 'Ready for Pickup',
    organicCertified: false,
    description: ''
  });

  const categories = [
    { id: 'All', label: t('market.allCategories') },
    { id: 'grains', label: t('market.grains') },
    { id: 'vegetables', label: t('market.vegetables') },
  ];

  const filteredListings = listings.filter((item) => {
    if (category === 'All') return true;
    return item.category === category;
  });

  const handlePostListing = (e) => {
    e.preventDefault();
    if (!newCrop.cropName || !newCrop.pricePerQuintal || !newCrop.farmerName) {
      alert("Please fill required fields.");
      return;
    }

    const created = {
      id: `item-${Date.now()}`,
      cropName: newCrop.cropName,
      category: newCrop.category,
      variety: newCrop.variety || "Local High-Yield Variety",
      quantity: newCrop.quantity || "50 Quintals",
      pricePerQuintal: parseInt(newCrop.pricePerQuintal),
      mandiBenchmark: parseInt(newCrop.pricePerQuintal) - 200,
      farmerName: newCrop.farmerName,
      village: newCrop.village || "Local Farm",
      district: newCrop.district || "Local District",
      state: "Punjab",
      phone: newCrop.phone || "+91 98765 43210",
      whatsapp: (newCrop.phone || "9876543210").replace(/[^0-9]/g, ''),
      harvestDate: newCrop.harvestDate,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400",
      organicCertified: newCrop.organicCertified,
      description: newCrop.description || "Fresh harvested produce available for direct pickup."
    };

    setListings([created, ...listings]);
    setIsModalOpen(false);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    alert(lang === 'hi' ? "आपकी फसल किसान बाज़ार पर पोस्ट हो गई है!" : "Harvest listed on Agri Bazaar!");
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/30 backdrop-blur border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 mb-4">
            <BadgePercent className="w-3.5 h-3.5 text-amber-300" />
            <span>0% Commission • Direct Farm Gate Procurement</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {t('market.title')}
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">
            {t('market.subtitle')}
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg transition hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('market.listProduceBtn')}</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              category === c.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group hover:border-emerald-400"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.cropName}
                  width={400}
                  height={192}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                {item.organicCertified && (
                  <span className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Organic Certified
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {item.quantity}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition">
                    {item.cropName}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Variety: {item.variety}
                </p>

                {/* Price Display */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 mb-4 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-slate-500 block">{t('market.askingPrice')}</span>
                    <span className="text-xl font-black text-emerald-800">
                      ₹{item.pricePerQuintal.toLocaleString('en-IN')}
                      <span className="text-xs font-medium text-emerald-600 ml-1">/ Qtl</span>
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                    {t('market.negotiable')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.harvestDate}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{item.village}, {item.district} ({item.state})</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2.5 rounded-lg">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Footer Connect */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`https://wa.me/${item.whatsapp}?text=Namaste%20${encodeURIComponent(item.farmerName)},%20I%20saw%20your%20listing%20for%20${encodeURIComponent(item.cropName)}%20on%20AgriMatter%20Bazaar.%20I%20am%20interested%20in%20purchasing.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Order</span>
              </a>
              <a
                href={`tel:${item.phone}`}
                className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Direct Selling Portal
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                {t('market.modalTitle')}
              </h3>
            </div>

            <form onSubmit={handlePostListing} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t('market.cropName')} *
                </label>
                <input
                  type="text"
                  required
                  value={newCrop.cropName}
                  onChange={(e) => setNewCrop({ ...newCrop, cropName: e.target.value })}
                  placeholder="e.g. Sharbati Wheat, Pusa Basmati, Fresh Tomatoes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('market.quantity')}
                  </label>
                  <input
                    type="text"
                    value={newCrop.quantity}
                    onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
                    placeholder="e.g. 100 Quintals"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('market.priceExpectation')} (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newCrop.pricePerQuintal}
                    onChange={(e) => setNewCrop({ ...newCrop, pricePerQuintal: e.target.value })}
                    placeholder="e.g. 2600"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('market.farmerName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCrop.farmerName}
                    onChange={(e) => setNewCrop({ ...newCrop, farmerName: e.target.value })}
                    placeholder="e.g. Hardeep Singh"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCrop.phone}
                    onChange={(e) => setNewCrop({ ...newCrop, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Location (Village & District)
                </label>
                <input
                  type="text"
                  value={newCrop.village}
                  onChange={(e) => setNewCrop({ ...newCrop, village: e.target.value })}
                  placeholder="e.g. Khanna, Ludhiana"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organicCheck"
                  checked={newCrop.organicCertified}
                  onChange={(e) => setNewCrop({ ...newCrop, organicCertified: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <label htmlFor="organicCheck" className="text-slate-700 font-semibold cursor-pointer">
                  This crop is organically grown / certified
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition"
              >
                {t('market.postListing')}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
