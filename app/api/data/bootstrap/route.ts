import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/database';

export async function GET() {
  const db = await readDatabase();
  return NextResponse.json({
    users: db.users,
    doctors: db.doctors,
    patients: db.patients,
    appointments: db.appointments,
    activityFeed: db.activityFeed,
  });
}
