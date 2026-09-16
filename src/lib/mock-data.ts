import { Crop, FarmerCrop, Farm, UserProfile } from '@/types';

export const MOCK_PROFILE: UserProfile = {
  id: 'demo-farmer-id',
  full_name: 'Ramesh Kumar',
  phone: '9876543210',
  language: 'hi',
  state: 'Punjab',
  district: 'Ludhiana',
  village: 'Samrala',
  created_at: new Date().toISOString()
};

export const MOCK_FARM: Farm = {
  id: 'demo-farm-id',
  user_id: 'demo-farmer-id',
  land_size: 2.5,
  irrigation_type: 'Borewell',
  latitude: 29.34,
  longitude: 79.56,
  soil_type: 'Loam'
};

export const MOCK_CROPS: Crop[] = [
  { id: 'crop-1', name: 'Rice', season: 'Kharif', suitable_soils: ['Clay', 'Loam', 'Alluvial'], irrigation_need: 'High', sowing_months: ['June', 'July'], description: 'Paddy crop requiring high standing water and humid monsoon weather.' },
  { id: 'crop-2', name: 'Wheat', season: 'Rabi', suitable_soils: ['Loam', 'Clay', 'Alluvial'], irrigation_need: 'Medium', sowing_months: ['October', 'November'], description: 'Staple cereal crop grown in cool winter climate across North India.' },
  { id: 'crop-3', name: 'Maize', season: 'Kharif', suitable_soils: ['Loam', 'Black', 'Sandy'], irrigation_need: 'Medium', sowing_months: ['June', 'July'], description: 'Versatile crop used for grain and fodder, performs best in well-drained loams.' },
  { id: 'crop-4', name: 'Mustard', season: 'Rabi', suitable_soils: ['Loam', 'Sandy', 'Alluvial'], irrigation_need: 'Low', sowing_months: ['October', 'November'], description: 'Major oilseed crop in Rabi season with low irrigation requirements.' },
  { id: 'crop-5', name: 'Soybean', season: 'Kharif', suitable_soils: ['Black', 'Loam'], irrigation_need: 'Medium', sowing_months: ['June', 'July'], description: 'Rich protein oilseed suited for heavy black soils of central India.' },
  { id: 'crop-6', name: 'Tomato', season: 'All-season', suitable_soils: ['Loam', 'Red', 'Black'], irrigation_need: 'High', sowing_months: ['August', 'September', 'January'], description: 'Popular commercial vegetable crop grown under drip irrigation.' }
];

export const MOCK_FARMER_CROP: FarmerCrop = {
  id: 'farmer-crop-1',
  farm_id: 'demo-farm-id',
  crop_id: 'crop-2',
  crop_stage: 'Vegetative',
  sowing_date: '2025-11-15',
  crop_name: 'Wheat'
};