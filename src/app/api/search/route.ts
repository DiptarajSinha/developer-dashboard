import { NextResponse } from 'next/server';
import { fetchAllRepos } from '@/lib/github';

export async function GET() {
  const data = await fetchAllRepos();
  return NextResponse.json(data);
}