import { NextResponse } from 'next/server';
import { fetchNotifications } from '@/lib/github';

export async function GET() {
  const data = await fetchNotifications();
  return NextResponse.json(data);
}