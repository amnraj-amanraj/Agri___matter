import { NextRequest, NextResponse } from 'next/server';
import { fetchMandiPrices } from '@/lib/mandi';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const result = await fetchMandiPrices({
      state: searchParams.get('state') || undefined,
      district: searchParams.get('district') || undefined,
      commodity: searchParams.get('commodity') || undefined,
      limit: Math.min(Number(searchParams.get('limit') || 50), 100),
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Mandi data is unavailable.';
    return NextResponse.json({ success: false, error: message }, { status: 503 });
  }
}
