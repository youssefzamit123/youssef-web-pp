import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('patientEmail');

  try {
    const db = await readDatabase();
    const records = db.dentalRecords || [];
    const patientRecord = email ? records.find(r => r.patientEmail === email) : null;
    return NextResponse.json({ record: patientRecord });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
