import { NextResponse } from 'next/server';
import { fetchRepoDetails } from '@/lib/github';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  
  // Get the branch from the URL query params (e.g., ?branch=main)
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get('branch') || 'main';

  const data = await fetchRepoDetails(name, branch);
  return NextResponse.json(data);
}