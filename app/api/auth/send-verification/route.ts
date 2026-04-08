import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { canSendVerificationCode, storeVerificationCode } from '@/lib/email-verification-store';
import { createVerificationToken } from '@/lib/email-verification-token';

const CODE_TTL_MS = 10 * 60 * 1000;

type VerificationPayload = {
  email?: string;
  fullName?: string;
  role?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerificationPayload;

    if (!body.email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const sendState = canSendVerificationCode(body.email);
    if (!sendState.canSend) {
      return NextResponse.json(
        {
          error: `Veuillez patienter ${sendState.retryAfterSeconds}s avant de renvoyer un code.`,
        },
        { status: 429 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    storeVerificationCode(body.email, code);
    const verificationToken = createVerificationToken(body.email, code, CODE_TTL_MS);

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>Bienvenue sur DentAI</h2>
        <p>Bonjour ${body.fullName || 'utilisateur'},</p>
        <p>Votre compte ${body.role ? `<strong>${body.role}</strong>` : ''} a bien été créé.</p>
        <p>Voici votre code de vérification :</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px; margin: 8px 0;">${code}</p>
        <p>Ce code expire dans 10 minutes.</p>
        <p>Merci de faire confiance à DentAI.</p>
      </div>
    `;

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;

    if (!smtpUser || !smtpPass || !smtpFrom) {
      return NextResponse.json(
        {
          error: 'Configuration Gmail SMTP manquante',
          required: ['SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'],
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: body.email,
      subject: 'Code de vérification DentAI',
      html,
    });

    return NextResponse.json({ success: true, provider: 'gmail-smtp', verificationToken });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Requête invalide';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
