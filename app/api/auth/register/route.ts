import { NextResponse } from 'next/server';
import { calcAge, makeId, readDatabase, writeDatabase } from '@/lib/database';
import type { User, UserRole, RiskLevel } from '@/lib/types';

type RegisterPayload = {
  email?: string;
  role?: UserRole;
  prenom?: string;
  nom?: string;
  dateNaissance?: string;
  localisation?: string;
  relations?: string;
};

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 70) return 'Élevé';
  if (score >= 40) return 'Modéré';
  return 'Faible';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload;

    if (!body.email || !body.role || !body.prenom || !body.nom) {
      return NextResponse.json({ error: 'Informations d\'inscription incomplètes' }, { status: 400 });
    }

    const db = await readDatabase();

    const name = `${body.prenom} ${body.nom}`.trim();
    const avatar = `${body.prenom.charAt(0)}${body.nom.charAt(0)}`.toUpperCase();
    const age = calcAge(body.dateNaissance);
    const isKid = body.role === 'Patient' && age < 12;

    if (body.role === 'Médecin') {
      const existingRequest = db.doctorRequests.find(r => r.email.toLowerCase() === body.email!.toLowerCase());
      if (existingRequest) {
        return NextResponse.json({ success: true, pendingApproval: true, message: 'Demande déjà envoyée' });
      }
      db.doctorRequests.push({
        id: makeId('req'),
        name,
        email: body.email!,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      await writeDatabase(db);
      return NextResponse.json({ success: true, pendingApproval: true, message: 'Demande en attente d\'approbation par un administrateur.' });
    }

    let user = db.users.find(
      u => u.email.toLowerCase() === body.email!.toLowerCase() && u.role === body.role
    );

    if (!user) {
      user = {
        id: makeId('user'),
        name,
        email: body.email,
        role: body.role,
        avatar,
        dateOfBirth: body.dateNaissance,
        localisation: body.localisation,
        relations: body.relations,
        isKid,
      } as User;
      db.users.push(user);
    } else {
      user.name = name;
      user.avatar = avatar;
      user.dateOfBirth = body.dateNaissance;
      user.localisation = body.localisation;
      user.relations = body.relations;
      user.isKid = isKid;
    }

    if (body.role === 'Patient') {
      const existingPatient = db.patients.find(p => p.patientEmail.toLowerCase() === body.email!.toLowerCase());

      const selectedDoctor = db.doctors.find(d =>
        body.relations?.toLowerCase().includes(d.name.toLowerCase())
      ) || db.doctors[0];

      const riskScore = Math.min(95, Math.max(20, 30 + Math.floor(Math.random() * 55)));

      if (!existingPatient) {
        db.patients.push({
          id: makeId('patient'),
          name,
          age,
          gender: 'M',
          cin: '00000000',
          reference: `REF${Math.floor(Math.random() * 900 + 100)}`,
          riskScore,
          riskLevel: riskLevelFromScore(riskScore),
          lastVisit: new Date().toISOString().slice(0, 10),
          dateOfBirth: body.dateNaissance,
          phone: '',
          medicalHistory: 'Aucune',
          doctor: selectedDoctor?.name || 'Non assigné',
          insurance: 'CNAM',
          patientEmail: body.email,
        });
      } else {
        existingPatient.name = name;
        existingPatient.age = age;
        existingPatient.dateOfBirth = body.dateNaissance;
        existingPatient.doctor = selectedDoctor?.name || existingPatient.doctor;
      }
    }

    await writeDatabase(db);

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
