import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ponytail: in-memory rate limit, resets on deploy. Upgrade to Redis if scaled.
const RATE_LIMIT = new Map<string, number[]>();
const MAX_PER_MINUTE = 3;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function pruneExpiredRateLimits(now: number) {
  if (RATE_LIMIT.size > 500) {
    for (const [key, times] of RATE_LIMIT.entries()) {
      const active = times.filter(t => now - t < 60000);
      if (active.length === 0) {
        RATE_LIMIT.delete(key);
      } else {
        RATE_LIMIT.set(key, active);
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // SEC-004: Validate Origin against Host header
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json({ success: false, error: 'Origin tidak diizinkan.' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ success: false, error: 'Origin tidak valid.' }, { status: 403 });
      }
    }

    // SEC-003: Rate limiting with bounded memory & robust IP resolution
    let ip = 'unknown';
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
      const ips = forwardedFor.split(',').map((s) => s.trim());
      ip = ips[ips.length - 1] || 'unknown';
    } else {
      ip = req.headers.get('x-real-ip') || 'unknown';
    }
    const now = Date.now();
    pruneExpiredRateLimits(now);

    const timestamps = RATE_LIMIT.get(ip)?.filter(t => now - t < 60000) || [];
    
    if (timestamps.length >= MAX_PER_MINUTE) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' }, { status: 429 });
    }
    
    timestamps.push(now);
    RATE_LIMIT.set(ip, timestamps);

    const body = await req.json();

    // Input existence and type validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Payload tidak valid.' }, { status: 400 });
    }

    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const category = String(body.category || 'General').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Harap isi semua kolom wajib.' }, { status: 400 });
    }

    if (name.length > 200 || email.length > 200 || category.length > 100 || message.length > 5000) {
      return NextResponse.json({ success: false, error: 'Batas panjang karakter terlampaui.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, error: 'Format alamat email tidak valid.' }, { status: 400 });
    }

    // Write to Firestore
    const docRef = await addDoc(collection(db, 'messages'), {
      name,
      email,
      category,
      message,
      is_read: false,
      created_at: serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err: unknown) {
    console.error('API Contact Error:', err);
    return NextResponse.json({ success: false, error: 'Gagal mengirim pesan ke server.' }, { status: 500 });
  }
}

