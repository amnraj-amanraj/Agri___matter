import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherData } from '@/lib/weather';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '30.9010');
  const lng = parseFloat(searchParams.get('lng') || '75.8573');
  const location = searchParams.get('location');

  try {
    const weather = await fetchWeatherData(lat, lng);
    if (location?.trim()) weather.location = location.trim();
    return NextResponse.json({ success: true, weather });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch weather forecast' },
      { status: 500 }
    );
  }
}
