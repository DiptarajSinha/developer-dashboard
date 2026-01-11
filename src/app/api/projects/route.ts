import { NextResponse } from 'next/server';
import { fetchGithubData } from '@/lib/github';

export async function GET() {
  const data = await fetchGithubData();
  return NextResponse.json(data);
}