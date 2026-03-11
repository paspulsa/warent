// File: app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // 1. Cari user di database
        const users = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        const user = users[0];

        // 2. Verifikasi Password (Jika pakai bcrypt, gunakan bcrypt.compare)
        if (!user || user.password !== password) {
            return NextResponse.json({ 
                success: false, 
                message: 'Email atau Password salah!' 
            }, { status: 401 });
        }

        // 3. Buat Token JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_wa_blast_123');
        const token = await new SignJWT({ 
            id: user.id, 
            email: user.email, 
            role: user.role 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h') // Berlaku 1 hari
            .sign(secret);

        // 4. Set Cookie secara aman
        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 hari
            path: '/',
        });

        return NextResponse.json({ 
            success: true, 
            role: user.role, 
            message: 'Login Berhasil!' 
        });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
