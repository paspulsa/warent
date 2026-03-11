export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
    try {
        // Ambil semua materi iklan untuk ditampilkan di dashboard admin
        const ads = await query('SELECT * FROM advertisements ORDER BY created_at DESC');
        return NextResponse.json({ success: true, data: ads });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal mengambil data iklan' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const token = cookies().get('token')?.value;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);

        const { title, message_content } = await request.json();

        // Simpan iklan baru ke database
        await query(
            'INSERT INTO advertisements (user_id, title, message_content, is_active) VALUES (?, ?, ?, TRUE)',
            [payload.id, title, message_content]
        );

        return NextResponse.json({ success: true, message: 'Materi iklan berhasil disimpan!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal menyimpan iklan' }, { status: 500 });
    }
}
