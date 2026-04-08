type VerificationEntry = {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
};

const verificationStore = new Map<string, VerificationEntry>();

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function canSendVerificationCode(email: string) {
  const normalized = normalizeEmail(email);
  const existing = verificationStore.get(normalized);

  if (!existing) {
    return { canSend: true, retryAfterSeconds: 0 };
  }

  const now = Date.now();
  const remaining = existing.lastSentAt + RESEND_COOLDOWN_MS - now;

  if (remaining > 0) {
    return {
      canSend: false,
      retryAfterSeconds: Math.ceil(remaining / 1000),
    };
  }

  return { canSend: true, retryAfterSeconds: 0 };
}

export function storeVerificationCode(email: string, code: string) {
  const normalized = normalizeEmail(email);
  const now = Date.now();

  verificationStore.set(normalized, {
    code,
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
    lastSentAt: now,
  });
}

export function verifyEmailCode(email: string, code: string) {
  const normalized = normalizeEmail(email);
  const entry = verificationStore.get(normalized);

  if (!entry) {
    return { ok: false, error: 'Aucun code trouvé pour cet email.' };
  }

  if (Date.now() > entry.expiresAt) {
    verificationStore.delete(normalized);
    return { ok: false, error: 'Code expiré. Veuillez demander un nouveau code.' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    verificationStore.delete(normalized);
    return { ok: false, error: 'Trop de tentatives. Veuillez demander un nouveau code.' };
  }

  if (entry.code !== code.trim()) {
    entry.attempts += 1;
    verificationStore.set(normalized, entry);
    return { ok: false, error: 'Code invalide.' };
  }

  verificationStore.delete(normalized);
  return { ok: true };
}
