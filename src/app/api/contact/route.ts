import { NextRequest, NextResponse } from 'next/server';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ponytail: in-memory rate limit, resets on deploy. Upgrade to Redis if scaled.
const RATE_LIMIT = new Map<string, number[]>();
const MAX_PER_MINUTE = 3;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const timestamps = RATE_LIMIT.get(ip)?.filter(t => now - t < 60000) || [];
    
    if (timestamps.length >= MAX_PER_MINUTE) {
      return NextResponse.json({ success: false, error: 'Terlalu banyak permintaan. Coba lagi nanti.' }, { status: 429 });
    }
    
    timestamps.push(now);
    RATE_LIMIT.set(ip, timestamps);

    const body = await req.json();

    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ success: false, error: 'Data tidak lengkap.' }, { status: 400 });
    }

    // Write to Firestore using Client SDK but appending the secret
    const docRef = await addDoc(collection(db, 'messages'), {
      name: String(body.name).slice(0, 200),
      email: String(body.email).slice(0, 200),
      category: String(body.category || 'General').slice(0, 50),
      message: String(body.message).slice(0, 5000),
      is_read: false,
      created_at: serverTimestamp(),
      _secret: 'boatmie_contact_secret_2026' // Ponytail hack: bypass firestore rules without admin SDK
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err: any) {
    console.error('API Contact Error:', err);
    return NextResponse.json({ success: false, error: 'Gagal mengirim pesan.' }, { status: 500 });
  }
}
