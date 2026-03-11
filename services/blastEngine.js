// File: services/blastEngine.js
const { query } = require('../config/db');
const { executeTransaction } = require('../lib/db-transaction');

async function startBlast(waAccountId, limit, sock) {
    try {
        // 1. Ambil semua Iklan Aktif dari Admin
        const ads = await query('SELECT message_content FROM advertisements WHERE is_active = 1');
        if (ads.length === 0) throw new Error("Admin belum menginput materi iklan!");

        // 2. Ambil Kontak Target dari Admin (acak sejumlah limit)
        const targets = await query('SELECT phone_number FROM contacts ORDER BY RAND() LIMIT ?', [parseInt(limit)]);
        if (targets.length === 0) throw new Error("Database kontak kosong!");

        // 3. Ambil Konfigurasi Komisi dari Setting
        const settings = await query('SELECT setting_key, setting_value FROM app_settings');
        const comms = {};
        settings.forEach(s => comms[s.setting_key] = parseInt(s.setting_value));

        let successCount = 0;
        let failedCount = 0;

        for (const target of targets) {
            try {
                // Pilih pesan secara acak dari materi Admin (Randomizer)
                const randomMsg = ads[Math.floor(Math.random() * ads.length)].message_content;
                const remoteJid = `${target.phone_number.replace(/\D/g, '')}@s.whatsapp.net`;

                // Kirim Pesan via Baileys
                await sock.sendMessage(remoteJid, { text: randomMsg });
                
                successCount++;

                // Jeda waktu acak (5-10 detik) agar aman dari blokir
                await new Promise(res => setTimeout(res, Math.floor(Math.random() * 5000) + 5000));
            } catch (err) {
                console.error(`Gagal kirim ke ${target.phone_number}:`, err);
                failedCount++;
            }
        }

        // 4. Update Database & Bagi-bagi Cuan (Gunakan Transaksi Aman)
        await executeTransaction(async (connection) => {
            // Ambil ID User pemilik akun WA
            const [waAcc] = await connection.execute('SELECT user_id FROM whatsapp_accounts WHERE id = ?', [waAccountId]);
            const userId = waAcc[0].user_id;

            // Tambah Saldo Member (Reward Blast)
            await connection.execute(
                'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
                [comms.blast_commission, userId]
            );

            // Catat Transaksi Member
            await connection.execute(
                'INSERT INTO transactions (user_id, whatsapp_account_id, transaction_type, amount, description) VALUES (?, ?, "Blast_Reward", ?, ?)',
                [userId, waAccountId, comms.blast_commission, `Reward blast ${successCount} pesan`]
            );

            // Cek apakah user punya Atasan (Referral)
            const [user] = await connection.execute('SELECT referred_by FROM users WHERE id = ?', [userId]);
            if (user[0].referred_by) {
                const referrerId = user[0].referred_by;
                // Tambah Saldo Atasan
                await connection.execute(
                    'UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?',
                    [comms.referral_blast_commission, referrerId]
                );
                // Catat Transaksi Atasan
                await connection.execute(
                    'INSERT INTO transactions (user_id, transaction_type, amount, description) VALUES (?, "Referral_Bonus", ?, ?)',
                    [referrerId, comms.referral_blast_commission, `Bonus referral dari blast user ID ${userId}`]
                );
            }

            // Update statistik akun WA
            await connection.execute(
                'UPDATE whatsapp_accounts SET total_sent = total_sent + ?, total_failed = total_failed + ? WHERE id = ?',
                [successCount, failedCount, waAccountId]
            );
        });

        return { success: true, successCount, failedCount };
    } catch (error) {
        console.error("Blast Engine Error:", error.message);
        return { success: false, message: error.message };
    }
}

module.exports = { startBlast };
