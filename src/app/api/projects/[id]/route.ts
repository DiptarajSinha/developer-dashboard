import { NextResponse } from 'next/server';
import { fetchProjectById } from '@/lib/github';

export async function GET(
  request: Request,
  // Fix: Type definition for params is now a Promise
  { params }: { params: Promise<{ id: string }> }
) {
  // Fix: Unwrap the params using await before accessing properties
  const { id } = await params;
  
  const project = await fetchProjectById(id);
  
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}