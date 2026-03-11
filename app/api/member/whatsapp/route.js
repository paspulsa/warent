export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
    try {
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);

        // Ambil semua akun WA milik user ini
        const accounts = await query(
            'SELECT id, phone_number, client_id, status, total_sent, total_failed FROM whatsapp_accounts WHERE user_id = ?',
            [payload.id]
        );

        return NextResponse.json({ success: true, data: accounts });
    } catch (error) {
        console.error("GET_WA_ACCOUNTS_ERROR:", error);
        return NextResponse.json({ success: false, message: 'Gagal mengambil data akun' }, { status: 500 });
    }
}

// API untuk tambah akun baru (jika diperlukan di masa depan)
export async function POST(request) {
    try {
        const token = cookies().get('token')?.value;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);
        
        const { phone_number, client_id } = await request.json();

        await query(
            'INSERT INTO whatsapp_accounts (user_id, phone_number, client_id, status) VALUES (?, ?, ?, "Disconnected")',
            [payload.id, phone_number, client_id]
        );

        return NextResponse.json({ success: true, message: 'Akun berhasil ditambahkan' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
