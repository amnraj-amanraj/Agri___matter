export type Language = 'en' | 'hi';

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  language: Language;
  state: string;
  district: string;
  village?: string;
  created_at?: string;
}

export interface Farm {
  id: string;
  user_id: string;
  land_size: number; // in acres
  irrigation_type: 'Rainfed' | 'Borewell' | 'Canal' | 'Drip' | 'Sprinkler';
  latitude: number;
  longitude: number;
  soil_type: 'Clay' | 'Loam' | 'Sandy' | 'Black' | 'Red' | 'Alluvial';
}

export interface Crop {
  id: string;
  name: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All-season';
  suitable_soils: string[];
  irrigation_need: 'Low' | 'Medium' | 'High';
  sowing_months: string[];
  description: string;
}

export interface FarmerCrop {
  id: string;
  farm_id: string;
  crop_id: string;
  crop_stage: 'Sowing' | 'Vegetative' | 'Flowering' | 'Harvesting';
  sowing_date: string;
  crop_name?: string;
}

export interface SoilReport {
  id?: string;
  farm_id: string;
  ph: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  report_date: string;
}

export interface WeatherAlert {
  id: string;
  farm_id: string;
  alert_type: 'Rain' | 'Frost' | 'Heatwave' | 'HighWind' | 'Normal';
  alert_date: string;
  message: {
    en: string;
    hi: string;
  };
}

export interface WeatherForecast {
  location: string;
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    condition: string;
    conditionCode: number;
    icon: string;
  };
  daily: Array<{
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    precipitationProb: number;
    precipitation: number;
    sunrise: string;
    sunset: string;
    windSpeed: number;
    evapotranspiration: number;
    condition: string;
  }>;
  hourly: Array<{
    time: string;
    temp: number;
    precipitationProb: number;
    precipitation: number;
    humidity: number;
    windSpeed: number;
    evapotranspiration: number;
    soilTemperature: number;
    soilMoisture: number;
    conditionCode: number;
  }>;
  farmingAdvice: {
    en: string;
    hi: string;
  };
}

export interface CropRecommendationResult {
  crop: Crop;
  matchScore: number; // 0 to 100
  suitability: 'High' | 'Moderate' | 'Low';
  reasons: {
    en: string[];
    hi: string[];
  };
}

export interface FertilizerAdvice {
  cropName: string;
  stage: string;
  generalAdvice: {
    en: string;
    hi: string;
  };
  nitrogenDosage: string;
  phosphorusDosage: string;
  potassiumDosage: string;
  organicAlternatives: {
    en: string[];
    hi: string[];
  };
  disclaimer: {
    en: string;
    hi: string;
  };
}

export interface SoilAdviceResult {
  phStatus: {
    en: string;
    hi: string;
  };
  nutrientStatus: {
    nitrogen: { level: 'Low' | 'Medium' | 'Optimal'; en: string; hi: string };
    phosphorus: { level: 'Low' | 'Medium' | 'Optimal'; en: string; hi: string };
    potassium: { level: 'Low' | 'Medium' | 'Optimal'; en: string; hi: string };
  };
  recommendations: {
    en: string[];
    hi: string[];
  };
}
