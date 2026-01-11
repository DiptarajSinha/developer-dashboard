import { NextResponse } from 'next/server';
import { fetchRepoLanguages } from '@/lib/github';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const data = await fetchRepoLanguages(name);
  return NextResponse.json(data);
}