import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminSession,
  createAdminSession,
  destroyAdminSession,
  verifyPin,
} from '@/lib/serverAuth';

// GET: Periksa status autentikasi session cookie
export async function GET() {
  const isAuthenticated = await verifyAdminSession();
  return NextResponse.json({ authenticated: isAuthenticated });
}

// POST: Login dengan verifikasi PIN di server
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Passcode PIN wajib diisi.' },
        { status: 400 }
      );
    }

    const isValid = verifyPin(pin);

    if (!isValid) {
      // Jeda 600ms sebagai pertahanan anti brute-force otomatis
      await new Promise((resolve) => setTimeout(resolve, 600));
      return NextResponse.json(
        { success: false, error: 'Passcode otorisasi salah. Akses ditolak.' },
        { status: 401 }
      );
    }

    await createAdminSession();
    return NextResponse.json({ success: true, message: 'Otorisasi berhasil.' });
  } catch (err) {
    console.error('Admin auth route error:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}

// DELETE: Logout dan hapus cookie
export async function DELETE() {
  await destroyAdminSession();
  return NextResponse.json({ success: true, message: 'Session telah dihapus.' });
}
