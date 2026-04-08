import { NextResponse } from 'next/server';
import { makeId, readDatabase, writeDatabase } from '@/lib/database';

type ChatPayload = {
  patientEmail?: string;
  doctorId?: string;
  from?: 'patient' | 'doctor';
  text?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientEmail = searchParams.get('patientEmail')?.toLowerCase();
  const doctorId = searchParams.get('doctorId');

  const db = await readDatabase();
  const chats = db.chats.filter(msg => {
    const emailMatch = patientEmail ? msg.patientEmail.toLowerCase() === patientEmail : true;
    const doctorMatch = doctorId ? msg.doctorId === doctorId : true;
    return emailMatch && doctorMatch;
  });

  return NextResponse.json({ chats });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatPayload;

    if (!body.patientEmail || !body.doctorId || !body.text) {
      return NextResponse.json({ error: 'Message incomplet' }, { status: 400 });
    }

    const db = await readDatabase();

    const message = {
      id: makeId('chat'),
      doctorId: body.doctorId,
      patientEmail: body.patientEmail,
      from: body.from || 'patient',
      text: body.text,
      timestamp: new Date().toISOString(),
    };

    db.chats.push(message);
    await writeDatabase(db);

    return NextResponse.json({ success: true, message });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
