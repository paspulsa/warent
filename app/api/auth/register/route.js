// File: app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { v4 as uuidv4 } from 'uuid'; // Untuk generate kode unik

export async function POST(request) {
    try {
        const { first_name, last_name, email, password, ref_code } = await request.json();

        // 1. Cek apakah email sudah terdaftar
        const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return NextResponse.json({ success: false, message: 'Email sudah digunakan!' }, { status: 400 });
        }

        // 2. Cari ID pengajak berdasarkan kode referral (jika ada)
        let referredById = null;
        if (ref_code) {
            const referrer = await query('SELECT id FROM users WHERE referral_code = ?', [ref_code]);
            if (referrer.length > 0) referredById = referrer[0].id;
        }

        // 3. Buat kode referral untuk user baru (ambil 8 karakter pertama dari UUID)
        const newReferralCode = uuidv4().split('-')[0].toUpperCase();

        // 4. Simpan ke database
        const result = await query(
            `INSERT INTO users (first_name, last_name, email, password, role, referral_code, referred_by, wallet_balance) 
             VALUES (?, ?, ?, ?, 'member', ?, ?, 0.00)`,
            [first_name, last_name, email, password, newReferralCode, referredById]
        );

        return NextResponse.json({ 
            success: true, 
            message: 'Registrasi berhasil! Silahkan login.' 
        }, { status: 201 });

    } catch (error) {
        console.error('Register Error:', error);
        return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
    }
}
