import { WeatherForecast } from '@/types';

const labels: Record<number, string> = { 0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast', 45: 'Foggy', 48: 'Foggy', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle', 61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers', 95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm' };
type ApiData = { current?: { temperature_2m?: number; precipitation?: number; weather_code?: number; wind_speed_10m?: number; relative_humidity_2m?: number }; hourly?: { time?: string[]; temperature_2m?: number[]; precipitation_probability?: number[] }; daily?: { time?: string[]; weather_code?: number[]; temperature_2m_max?: number[]; temperature_2m_min?: number[]; precipitation_probability_max?: number[] } };

export async function fetchWeatherData(lat = 30.9010, lng = 75.8573): Promise<WeatherForecast> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7_000);
  try {
    const query = new URLSearchParams({ latitude: String(lat), longitude: String(lng), timezone: 'auto', forecast_days: '7', current: 'temperature_2m,precipitation,weather_code,wind_speed_10m,relative_humidity_2m', hourly: 'temperature_2m,precipitation_probability', daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error(`Weather service returned ${response.status}`);
    const data = await response.json() as ApiData;
    if (!data.current || !data.daily?.time?.length) throw new Error('Weather service returned incomplete data');
    const daily = data.daily.time.slice(0, 7).map((date, index) => ({ date, dayName: index === 0 ? 'Today' : new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(new Date(`${date}T12:00:00`)), tempMax: Math.round(data.daily?.temperature_2m_max?.[index] ?? 0), tempMin: Math.round(data.daily?.temperature_2m_min?.[index] ?? 0), precipitationProb: Math.round(data.daily?.precipitation_probability_max?.[index] ?? 0), condition: labels[data.daily?.weather_code?.[index] ?? 0] || 'Partly cloudy' }));
    const hourly = (data.hourly?.time || []).slice(0, 8).map((time, index) => ({ time: new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(time)), temp: Math.round(data.hourly?.temperature_2m?.[index] ?? 0), precipitationProb: Math.round(data.hourly?.precipitation_probability?.[index] ?? 0) }));
    const rainSoon = daily.slice(0, 2).some((day) => day.precipitationProb >= 60);
    return { location: 'Your farm location', current: { temp: Math.round(data.current.temperature_2m ?? 0), humidity: Math.round(data.current.relative_humidity_2m ?? 0), windSpeed: Math.round(data.current.wind_speed_10m ?? 0), precipitation: Math.round(data.current.precipitation ?? 0), condition: labels[data.current.weather_code ?? 0] || 'Partly cloudy', conditionCode: data.current.weather_code ?? 0, icon: rainSoon ? 'CloudRain' : 'Sun' }, daily, hourly, farmingAdvice: rainSoon ? { en: 'Rain is likely soon. Avoid spraying, check drainage, and protect harvested produce.', hi: 'जल्द बारिश की संभावना है। छिड़काव न करें, जल निकासी जांचें और कटी फसल को सुरक्षित रखें।' } : { en: 'Weather is suitable for a field walk. Check soil moisture before irrigating.', hi: 'खेत की जांच के लिए मौसम अनुकूल है। सिंचाई से पहले मिट्टी की नमी जांचें।' } };
  } catch (error) {
    console.warn('Using offline weather fallback:', error);
    return fallbackWeather();
  } finally { clearTimeout(timeout); }
}

function fallbackWeather(): WeatherForecast {
  const today = new Date();
  const daily = Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() + index); return { date: date.toLocaleDateString('en-CA'), dayName: index === 0 ? 'Today' : date.toLocaleDateString('en-IN', { weekday: 'short' }), tempMax: 32, tempMin: 24, precipitationProb: 20, condition: 'Forecast unavailable' }; });
  return { location: 'Your farm location', current: { temp: 30, humidity: 65, windSpeed: 10, precipitation: 0, condition: 'Forecast unavailable', conditionCode: 0, icon: 'Sun' }, daily, hourly: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((time, index) => ({ time, temp: 25 + index, precipitationProb: 20 })), farmingAdvice: { en: 'Live forecast is temporarily unavailable. Check local conditions before spraying or irrigating.', hi: 'लाइव पूर्वानुमान अस्थायी रूप से उपलब्ध नहीं है। छिड़काव या सिंचाई से पहले स्थानीय मौसम जांचें।' } };
}
