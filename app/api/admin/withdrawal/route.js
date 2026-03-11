export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Ambil semua daftar pengajuan WD (Admin Only)
export async function GET() {
    try {
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== 'admin') return NextResponse.json({ success: false }, { status: 403 });

        // Query join untuk mendapatkan nama user yang menarik dana
        const withdrawals = await query(`
            SELECT 
                w.*, 
                u.first_name, 
                u.last_name, 
                u.email 
            FROM withdrawals w
            JOIN users u ON w.user_id = u.id
            ORDER BY w.created_at DESC
        `);

        return NextResponse.json({ 
            success: true, 
            data: withdrawals 
        });
    } catch (error) {
        console.error("ADMIN_GET_WD_ERROR:", error);
        return NextResponse.json({ success: false, message: 'Gagal memuat data penarikan' }, { status: 500 });
    }
}
