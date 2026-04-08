import { NextResponse } from 'next/server';
import { verifyVerificationToken } from '@/lib/email-verification-token';

type VerifyPayload = {
  email?: string;
  code?: string;
  verificationToken?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyPayload;

    if (!body.email || !body.code || !body.verificationToken) {
      return NextResponse.json(
        { error: 'Email, code et token de vérification requis' },
        { status: 400 }
      );
    }

    const result = verifyVerificationToken(body.verificationToken, body.email, body.code);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
