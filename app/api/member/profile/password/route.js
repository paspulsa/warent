// File: app/api/member/profile/password/route.js
import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function PATCH(request) {
    try {
        const { currentPassword, newPassword } = await request.json();
        
        // 1. Ambil ID User dari Token
        const token = cookies().get('token')?.value;
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.id;

        // 2. Verifikasi Password Lama
        const userRows = await query('SELECT password FROM users WHERE id = ?', [userId]);
        const user = userRows[0];

        if (user.password !== currentPassword) {
            return NextResponse.json({ 
                success: false, 
                message: 'Password lama Anda salah!' 
            }, { status: 400 });
        }

        // 3. Update Password Baru
        await query('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);

        return NextResponse.json({ 
            success: true, 
            message: 'Password berhasil diperbarui!' 
        });

    } catch (error) {
        console.error('Change Password Error:', error);
        return NextResponse.json({ success: false, message: 'Gagal mengubah password' }, { status: 500 });
    }
}
