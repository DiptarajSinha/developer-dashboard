import { NextResponse } from 'next/server';
import { fetchRecentPullRequests } from '@/lib/github';

export async function GET() {
  const data = await fetchRecentPullRequests();
  return NextResponse.json(data);
}