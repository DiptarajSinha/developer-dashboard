import { NextResponse } from 'next/server';
import { fetchVercelDeployments } from '@/lib/vercel';

export async function GET() {
  const deployments = await fetchVercelDeployments();
  return NextResponse.json(deployments);
}