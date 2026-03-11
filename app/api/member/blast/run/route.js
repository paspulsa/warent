// File: app/api/member/blast/run/route.js
import { NextResponse } from 'next/server';
import { startBlast } from '@/services/blastEngine';
import { getSocketByClientId } from '@/services/whatsappManager'; // Helper untuk ambil session yang aktif

export async function POST(request) {
    try {
        const { waAccountId, clientId, limit } = await request.json();

        // Ambil koneksi Baileys yang sedang aktif di memory worker
        const sock = getSocketByClientId(clientId);
        if (!sock) {
            return NextResponse.json({ success: false, message: "WhatsApp belum terhubung!" }, { status: 400 });
        }

        // Jalankan mesin blast (Background)
        // Kita tidak pakai 'await' agar respons API cepat, proses jalan di belakang
        startBlast(waAccountId, limit, sock);

        return NextResponse.json({ 
            success: true, 
            message: "Proses blast telah dimulai. Silahkan cek dashboard secara berkala." 
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
