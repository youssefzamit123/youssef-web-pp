import { NextResponse } from 'next/server';
import { readDatabase } from '@/lib/database';
import type { UserRole } from '@/lib/types';

type LoginPayload = {
  email?: string;
  role?: UserRole;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginPayload;

    if (!body.email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const db = await readDatabase();
    
    // Check pending requests
    const pendingRequest = db.doctorRequests.find(
      r => r.email.toLowerCase() === body.email!.toLowerCase() && r.status === 'pending'
    );
    
    if (pendingRequest) {
      return NextResponse.json({ error: 'Compte en attente d\'approbation par un administrateur' }, { status: 403 });
    }
    
    const user = db.users.find(
      u => u.email.toLowerCase() === body.email!.toLowerCase()
    );

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
