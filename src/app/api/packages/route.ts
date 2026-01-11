import { NextResponse } from 'next/server';
import { fetchPackages } from '@/lib/github';

export async function GET() {
  const data = await fetchPackages();
  return NextResponse.json(data);
}