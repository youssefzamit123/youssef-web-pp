import { NextResponse } from 'next/server';
import { makeId, readDatabase, writeDatabase } from '@/lib/database';

type AppointmentPayload = {
  patientEmail?: string;
  doctorId?: string;
  date?: string;
  time?: string;
  location?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientEmail = searchParams.get('patientEmail')?.toLowerCase();

  const db = await readDatabase();
  const appointments = patientEmail
    ? db.appointments.filter(a => a.patientEmail.toLowerCase() === patientEmail)
    : db.appointments;

  return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AppointmentPayload;

    if (!body.patientEmail || !body.doctorId || !body.date || !body.time || !body.location) {
      return NextResponse.json({ error: 'Champs rendez-vous manquants' }, { status: 400 });
    }

    const db = await readDatabase();
    const doctor = db.doctors.find(d => d.id === body.doctorId);

    if (!doctor) {
      return NextResponse.json({ error: 'Médecin introuvable' }, { status: 404 });
    }

    const appointment = {
      id: makeId('apt'),
      date: body.date,
      time: body.time,
      doctor: doctor.name,
      type: 'Consultation patient',
      status: 'en attente' as const,
      doctorId: doctor.id,
      patientEmail: body.patientEmail,
      location: body.location,
    };

    db.appointments.unshift(appointment);
    await writeDatabase(db);

    return NextResponse.json({ success: true, appointment });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
