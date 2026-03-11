// File: app/api/admin/withdrawal/update/route.js
import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { executeTransaction } from '@/lib/db-transaction';

export async function PATCH(request) {
    try {
        const { withdrawalId, action } = await request.json(); // action: 'Accepted' atau 'Rejected'

        await executeTransaction(async (connection) => {
            const [wd] = await connection.execute('SELECT * FROM withdrawals WHERE id = ? AND status = "Pending"', [withdrawalId]);
            if (wd.length === 0) throw new Error('Data tidak ditemukan atau sudah diproses.');

            const { user_id, amount } = wd[0];

            if (action === 'Accepted') {
                await connection.execute('UPDATE withdrawals SET status = "Accepted", processed_at = NOW() WHERE id = ?', [withdrawalId]);
            } else {
                // Jika Ditolak, kembalikan saldo ke user
                await connection.execute('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [amount, user_id]);
                await connection.execute('UPDATE withdrawals SET status = "Rejected", processed_at = NOW() WHERE id = ?', [withdrawalId]);
                
                // Catat transaksi pengembalian
                await connection.execute(
                    'INSERT INTO transactions (user_id, transaction_type, amount, description) VALUES (?, "System_Adjustment", ?, "Pengembalian dana penarikan ditolak")',
                    [user_id, amount]
                );
            }
        });

        return NextResponse.json({ success: true, message: `Status penarikan diperbarui menjadi ${action}` });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
