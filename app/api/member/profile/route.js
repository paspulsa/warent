export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Ambil Data Profil Member
export async function GET() {
    try {
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ success: false }, { status: 401 });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);

        const userRows = await query(
            'SELECT first_name, last_name, email, bank_name, bank_account_number, bank_account_name, wallet_balance, referral_code FROM users WHERE id = ?',
            [payload.id]
        );

        if (userRows.length === 0) return NextResponse.json({ success: false }, { status: 404 });

        return NextResponse.json({ success: true, data: userRows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Update Data Bank & Profil
export async function PATCH(request) {
    try {
        const token = cookies().get('token')?.value;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);

        const { first_name, last_name, bank_name, bank_account_number, bank_account_name } = await request.json();

        await query(
            `UPDATE users SET 
                first_name = ?, 
                last_name = ?, 
                bank_name = ?, 
                bank_account_number = ?, 
                bank_account_name = ? 
             WHERE id = ?`,
            [first_name, last_name, bank_name, bank_account_number, bank_account_name, payload.id]
        );

        return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
