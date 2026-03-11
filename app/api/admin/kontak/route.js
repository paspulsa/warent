export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Ambil semua kontak (Admin Only)
export async function GET() {
    try {
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        const contacts = await query('SELECT * FROM contacts ORDER BY created_at DESC');
        
        return NextResponse.json({ 
            success: true, 
            data: contacts 
        });
    } catch (error) {
        console.error("ADMIN_GET_CONTACTS_ERROR:", error);
        return NextResponse.json({ success: false, message: 'Gagal mengambil data kontak' }, { status: 500 });
    }
}

// Tambah kontak manual (Admin Only)
export async function POST(request) {
    try {
        const token = cookies().get('token')?.value;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== 'admin') return NextResponse.json({ success: false }, { status: 403 });

        const { phone_number, name } = await request.json();

        if (!phone_number) return NextResponse.json({ success: false, message: 'Nomor WA wajib diisi' }, { status: 400 });

        await query(
            'INSERT INTO contacts (user_id, phone_number, name) VALUES (?, ?, ?)',
            [payload.id, phone_number, name || 'No Name']
        );

        return NextResponse.json({ success: true, message: 'Kontak berhasil ditambahkan!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
