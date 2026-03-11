// File: app/api/member/withdrawal/route.js
import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { executeTransaction } from '@/lib/db-transaction';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function POST(request) {
    try {
        const { amount, bank_name, bank_account_number, bank_account_name } = await request.json();
        
        // 1. Ambil ID User dari Token
        const token = cookies().get('token')?.value;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id;

        // 2. Jalankan Transaksi Database
        const result = await executeTransaction(async (connection) => {
            // Cek saldo terkini
            const [user] = await connection.execute('SELECT wallet_balance FROM users WHERE id = ? FOR UPDATE', [userId]);
            
            if (user[0].wallet_balance < amount) {
                throw new Error('Saldo tidak mencukupi!');
            }

            if (amount < 50000) {
                throw new Error('Minimal penarikan adalah Rp 50.000');
            }

            // Potong Saldo User
            await connection.execute('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?', [amount, userId]);

            // Catat ke tabel Withdrawals
            await connection.execute(
                `INSERT INTO withdrawals (user_id, amount, bank_name, bank_account_number, bank_account_name, status) 
                 VALUES (?, ?, ?, ?, ?, 'Pending')`,
                [userId, amount, bank_name, bank_account_number, bank_account_name]
            );

            // Catat ke riwayat transaksi
            await connection.execute(
                `INSERT INTO transactions (user_id, transaction_type, amount, description) 
                 VALUES (?, 'Withdrawal', ?, ?)`,
                [userId, -amount, `Penarikan dana via ${bank_name}`]
            );

            return { success: true };
        });

        return NextResponse.json({ success: true, message: 'Permintaan penarikan berhasil dikirim!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
