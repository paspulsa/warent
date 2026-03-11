export const dynamic = 'force-dynamic'; // WAJIB DI BARIS 1 UNTUK MATIKAN PRERENDER

import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
    try {
        // 1. Ambil Cookie
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // 2. Verifikasi JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id;

        // 3. Jalankan Query ke Database
        const userRows = await query(
            'SELECT wallet_balance, referral_code FROM users WHERE id = ?', 
            [userId]
        );
        
        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        const user = userRows[0];

        const waStats = await query(
            `SELECT 
                COUNT(*) as total_accounts,
                SUM(CASE WHEN status = 'Connected' THEN 1 ELSE 0 END) as active_accounts,
                SUM(COALESCE(total_sent, 0)) as total_sent,
                SUM(COALESCE(total_failed, 0)) as total_failed
             FROM whatsapp_accounts WHERE user_id = ?`,
            [userId]
        );

        const refStats = await query(
            "SELECT SUM(amount) as total_ref_bonus FROM transactions WHERE user_id = ? AND transaction_type = 'Referral_Bonus'",
            [userId]
        );

        return NextResponse.json({
            success: true,
            data: {
                balance: user.wallet_balance || 0,
                referral_code: user.referral_code || '',
                total_wa: waStats[0]?.total_accounts || 0,
                active_wa: waStats[0]?.active_accounts || 0,
                sent: waStats[0]?.total_sent || 0,
                failed: waStats[0]?.total_failed || 0,
                ref_bonus: refStats[0]?.total_ref_bonus || 0
            }
        });

    } catch (error) {
        console.error("STATS_ERROR:", error.message);
        return NextResponse.json(
            { success: false, message: 'Gagal memuat data' }, 
            { status: 500 }
        );
    }
}
