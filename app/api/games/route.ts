import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/database';

export async function GET() {
  try {
    const db = await readDatabase();
    return NextResponse.json({ games: db.games || [], rewards: db.rewardConfigs || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
