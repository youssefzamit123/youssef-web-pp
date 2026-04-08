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

    if (!body.email || !body.role) {
      return NextResponse.json({ error: 'Email et role requis' }, { status: 400 });
    }

    const db = await readDatabase();
    const user = db.users.find(
      u => u.email.toLowerCase() === body.email!.toLowerCase() && u.role === body.role
    );

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
