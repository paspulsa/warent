// File: app/api/admin/settings/route.js
import { NextResponse } from 'next/server';
import { query } from '@/config/db';

// Ambil semua setting
export async function GET() {
    try {
        const settings = await query('SELECT * FROM app_settings');
        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal mengambil setting' }, { status: 500 });
    }
}

// Update setting berdasarkan key
export async function PATCH(request) {
    try {
        const { blast_commission, referral_blast_commission } = await request.json();

        // Update Komisi Blast
        await query(
            'UPDATE app_settings SET setting_value = ? WHERE setting_key = "blast_commission"',
            [blast_commission]
        );

        // Update Komisi Referral
        await query(
            'UPDATE app_settings SET setting_value = ? WHERE setting_key = "referral_blast_commission"',
            [referral_blast_commission]
        );

        return NextResponse.json({ success: true, message: 'Pengaturan berhasil diperbarui!' });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Gagal memperbarui pengaturan' }, { status: 500 });
    }
}
