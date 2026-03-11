// File: app/api/member/stats/route.js
import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
    try {
        // 1. Ambil ID User dari Token Cookie
        const token = cookies().get('token')?.value;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id;

        // 2. Ambil Data Saldo & Info Referral
        const userRows = await query(
            'SELECT wallet_balance, referral_code FROM users WHERE id = ?', 
            [userId]
        );
        const user = userRows[0];

        // 3. Ambil Statistik WhatsApp
        const waStats = await query(
            `SELECT 
                COUNT(*) as total_accounts,
                SUM(CASE WHEN status = 'Connected' THEN 1 ELSE 0 END) as active_accounts,
                SUM(total_sent) as total_sent,
                SUM(total_failed) as total_failed
             FROM whatsapp_accounts WHERE user_id = ?`,
            [userId]
        );

        // 4. Ambil Total Bonus Referral
        const refStats = await query(
            "SELECT SUM(amount) as total_ref_bonus FROM transactions WHERE user_id = ? AND transaction_type = 'Referral_Bonus'",
            [userId]
        );

        return NextResponse.json({
            success: true,
            data: {
                balance: user.wallet_balance || 0,
                referral_code: user.referral_code,
                total_wa: waStats[0].total_accounts || 0,
                active_wa: waStats[0].active_accounts || 0,
                sent: waStats[0].total_sent || 0,
                failed: waStats[0].total_failed || 0,
                ref_bonus: refStats[0].total_ref_bonus || 0
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal memuat statistik' }, { status: 500 });
    }
}
