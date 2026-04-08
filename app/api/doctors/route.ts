import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/database';

export async function GET() {
  const db = await readDatabase();
  return NextResponse.json({ doctors: db.doctors });
}
