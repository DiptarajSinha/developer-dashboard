import { NextResponse } from 'next/server';
import { fetchRecentDeployments } from '@/lib/github';

export async function GET() {
  const data = await fetchRecentDeployments();
  return NextResponse.json(data);
}