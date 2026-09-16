'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_CROPS } from '@/lib/mock-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, Plus, Edit, Trash2, Sprout, CloudSun, HardDrive } from 'lucide-react';

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const [crops, setCrops] = useState(MOCK_CROPS);
  const [newCropName, setNewCropName] = useState('');
  const [newSeason, setNewSeason] = useState('Kharif');

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim()) return;
    const newCrop = {
      id: `crop-${Date.now()}`,
      name: newCropName,
      season: newSeason as any,
      suitable_soils: ['Loam', 'Clay'],
      irrigation_need: 'Medium' as any,
      sowing_months: ['June', 'July'],
      description: `Newly added crop entry: ${newCropName}`
    };
    setCrops([...crops, newCrop]);
    setNewCropName('');
  };

  const handleDelete = (id: string) => {
    setCrops(crops.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 py-2">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-agri-green-900 flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 text-agri-brown-700" />
            <span>Admin Portal & Advisory Management</span>
          </h1>
          <p className="text-xs font-semibold text-gray-600">
            Control agricultural master crop records, stage advisories, and alert triggers.
          </p>
        </div>

        <Badge variant="brown" className="px-3 py-1">Admin Mode</Badge>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center space-x-4 bg-emerald-50 border-emerald-200">
          <div className="w-12 h-12 rounded-2xl bg-agri-green-700 text-white flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-agri-green-900">{crops.length}</span>
            <span className="text-xs font-bold text-gray-600 block">Master Crops</span>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 bg-sky-50 border-sky-200">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-sky-900">Active</span>
            <span className="text-xs font-bold text-gray-600 block">Open-Meteo Integration</span>
          </div>
        </Card>

        <Card className="flex items-center space-x-4 bg-amber-50 border-amber-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-amber-900">RLS Active</span>
            <span className="text-xs font-bold text-gray-600 block">Local browser storage</span>
          </div>
        </Card>
      </div>

      {/* Add New Crop Form */}
      <Card className="space-y-4 border-emerald-200">
        <h3 className="text-base font-extrabold text-agri-green-900">Add New Crop Record</h3>
        <form onSubmit={handleAddCrop} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Crop Name (e.g. Cotton, Barley)"
            value={newCropName}
            onChange={(e) => setNewCropName(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-gray-300 font-bold text-xs sm:text-sm"
          />
          <select
            value={newSeason}
            onChange={(e) => setNewSeason(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 font-bold text-xs sm:text-sm bg-white"
          >
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Zaid">Zaid</option>
            <option value="All-season">All-season</option>
          </select>
          <Button type="submit" size="md">
            <Plus className="w-4 h-4 mr-1" />
            <span>Add Crop</span>
          </Button>
        </form>
      </Card>

      {/* Crops Table */}
      <Card className="space-y-3 border-emerald-200 overflow-hidden">
        <h3 className="text-base font-extrabold text-agri-green-900">Existing Crops & Advisory Rules</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-50 text-agri-green-900 font-extrabold uppercase border-b border-emerald-200">
              <tr>
                <th className="p-3">Crop Name</th>
                <th className="p-3">Season</th>
                <th className="p-3">Suitable Soils</th>
                <th className="p-3">Water Need</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
              {crops.map((c) => (
                <tr key={c.id} className="hover:bg-emerald-50/30">
                  <td className="p-3 text-agri-green-900 font-black">{c.name}</td>
                  <td className="p-3"><Badge variant="green">{c.season}</Badge></td>
                  <td className="p-3">{c.suitable_soils.join(', ')}</td>
                  <td className="p-3">{c.irrigation_need}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
