import { NextResponse } from 'next/server';
import { fetchUserStats } from '@/lib/github';

export async function GET() {
  const data = await fetchUserStats();
  return NextResponse.json(data);
}