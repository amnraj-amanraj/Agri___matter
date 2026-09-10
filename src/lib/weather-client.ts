import { WeatherForecast } from '@/types';

/** Uses our server route so a slow third-party request cannot leave the UI loading forever. */
export async function fetchWeatherForFarm(lat: number, lng: number, location?: string): Promise<WeatherForecast> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 9_000);
  try {
    const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    if (location) params.set('location', location);
    const response = await fetch(`/api/weather?${params.toString()}`, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error('Weather service is unavailable');
    const payload = await response.json();
    if (!payload.success || !payload.weather) throw new Error(payload.error || 'Weather data is unavailable');
    return payload.weather as WeatherForecast;
  } finally {
    window.clearTimeout(timer);
  }
}
