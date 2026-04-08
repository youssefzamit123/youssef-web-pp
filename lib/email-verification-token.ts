import crypto from 'node:crypto';

type VerificationPayload = {
  email: string;
  code: string;
  exp: number;
};

function getSecret() {
  return process.env.EMAIL_VERIFICATION_SECRET || process.env.SMTP_PASS || 'dev-secret-change-me';
}

function toBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

export function createVerificationToken(email: string, code: string, ttlMs: number) {
  const payload: VerificationPayload = {
    email: email.trim().toLowerCase(),
    code,
    exp: Date.now() + ttlMs,
  };

  const payloadEncoded = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(payloadEncoded)
    .digest('base64url');

  return `${payloadEncoded}.${signature}`;
}

export function verifyVerificationToken(token: string, email: string, code: string) {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return { ok: false, error: 'Token invalide.' };
  }

  const [payloadEncoded, providedSignature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', getSecret())
    .update(payloadEncoded)
    .digest('base64url');

  if (providedSignature !== expectedSignature) {
    return { ok: false, error: 'Signature invalide.' };
  }

  let payload: VerificationPayload;
  try {
    payload = JSON.parse(fromBase64Url(payloadEncoded)) as VerificationPayload;
  } catch {
    return { ok: false, error: 'Payload invalide.' };
  }

  if (Date.now() > payload.exp) {
    return { ok: false, error: 'Code expiré. Veuillez demander un nouveau code.' };
  }

  if (payload.email !== email.trim().toLowerCase()) {
    return { ok: false, error: 'Email non correspondant.' };
  }

  if (payload.code !== code.trim()) {
    return { ok: false, error: 'Code invalide.' };
  }

  return { ok: true };
}
