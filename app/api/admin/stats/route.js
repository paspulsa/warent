// File: app/api/admin/stats/route.js
import { NextResponse } from 'next/server';
import { query } from '@/config/db';

export async function GET() {
    try {
        // 1. Total Member
        const userCount = await query("SELECT COUNT(*) as total FROM users WHERE role = 'member'");
        
        // 2. Total Saldo Beredar (Hutang Sistem ke Member)
        const totalBalance = await query("SELECT SUM(wallet_balance) as total FROM users");
        
        // 3. Statistik Pesan Global
        const msgStats = await query(
            "SELECT SUM(total_sent) as sent, SUM(total_failed) as failed FROM whatsapp_accounts"
        );
        
        // 4. Jumlah Antrian Penarikan (Pending)
        const pendingWD = await query("SELECT COUNT(*) as total FROM withdrawals WHERE status = 'Pending'");

        // 5. Data User Terbaru (5 orang)
        const recentUsers = await query(
            "SELECT first_name, email, created_at FROM users WHERE role = 'member' ORDER BY created_at DESC LIMIT 5"
        );

        return NextResponse.json({
            success: true,
            data: {
                total_users: userCount[0].total || 0,
                circulating_balance: totalBalance[0].total || 0,
                total_sent: msgStats[0].sent || 0,
                total_failed: msgStats[0].failed || 0,
                pending_withdrawals: pendingWD[0].total || 0,
                recent_users: recentUsers
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal memuat data dashboard' }, { status: 500 });
    }
}
