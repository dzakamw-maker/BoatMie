import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'boatmie_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 Hari

function getSecretKey(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PIN || 'boatmie_fallback_secret_key_2026';
}

function getExpectedPin(): string {
  return process.env.ADMIN_PIN || 'boatmie2026';
}

/**
 * Buat tanda tangan HMAC-SHA256 untuk payload
 */
function signPayload(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Validasi session token dari cookie httpOnly
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionCookie) return false;

    const [payload, signature] = sessionCookie.split('.');
    if (!payload || !signature) return false;

    const secret = getSecretKey();
    const expectedSig = signPayload(payload, secret);

    // Timing-safe equal check untuk mencegah timing attack
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSig, 'hex');
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return false;
    }

    const { expiresAt } = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    if (typeof expiresAt !== 'number' || Date.now() > expiresAt) {
      return false;
    }

    return true;
  } catch (err) {
    console.error('Session verification error:', err);
    return false;
  }
}

/**
 * Buat session cookie baru setelah verifikasi PIN berhasil
 */
export async function createAdminSession(): Promise<void> {
  const secret = getSecretKey();
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = Buffer.from(JSON.stringify({ role: 'admin', expiresAt })).toString('base64');
  const signature = signPayload(payload, secret);
  const token = `${payload}.${signature}`;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

/**
 * Hapus session cookie saat logout
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Verifikasi PIN yang diinput user
 */
export function verifyPin(inputPin: string): boolean {
  const expected = getExpectedPin();
  if (!inputPin || typeof inputPin !== 'string') return false;

  const inputBuffer = Buffer.from(inputPin);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}
