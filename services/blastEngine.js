// File: services/blastEngine.js
const { getSocketByClientId } = require('./whatsappManager');
const { query } = require('../config/db');
const { executeTransaction } = require('../lib/db-transaction');

async function processBlast(waAccountId, clientId, limit) {
    const sock = getSocketByClientId(clientId);
    if (!sock) return { success: false, message: "Sesi WhatsApp tidak ditemukan!" };

    try {
        // Ambil data dari Admin
        const ads = await query('SELECT message_content FROM advertisements WHERE is_active = 1');
        const targets = await query('SELECT phone_number FROM contacts ORDER BY RAND() LIMIT ?', [parseInt(limit)]);
        const settings = await query('SELECT setting_key, setting_value FROM app_settings');
        
        const comm = {};
        settings.forEach(s => comm[s.setting_key] = parseInt(s.setting_value));

        let success = 0;
        for (const target of targets) {
            const msg = ads[Math.floor(Math.random() * ads.length)].message_content;
            const jid = `${target.phone_number.replace(/\D/g, '')}@s.whatsapp.net`;
            
            await sock.sendMessage(jid, { text: msg });
            success++;
            
            // Delay 5-15 detik (Anti-Banned)
            await new Promise(r => setTimeout(r, Math.floor(Math.random() * 10000) + 5000));
        }

        // Hitung Cuan & Referral via Transaction
        await executeTransaction(async (db) => {
            const [acc] = await db.execute('SELECT user_id FROM whatsapp_accounts WHERE id = ?', [waAccountId]);
            const userId = acc[0].user_id;

            // 1. Reward Member
            const totalReward = success * comm.blast_commission;
            await db.execute('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [totalReward, userId]);
            await db.execute('INSERT INTO transactions (user_id, amount, transaction_type, description) VALUES (?, ?, "Blast_Reward", ?)', 
                [userId, totalReward, `Blast reward ${success} pesan`]);

            // 2. Bonus Referral
            const [u] = await db.execute('SELECT referred_by FROM users WHERE id = ?', [userId]);
            if (u[0].referred_by) {
                const bonus = success * comm.referral_blast_commission;
                await db.execute('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [bonus, u[0].referred_by]);
                await db.execute('INSERT INTO transactions (user_id, amount, transaction_type, description) VALUES (?, ?, "Referral_Bonus", ?)', 
                    [u[0].referred_by, bonus, `Referral bonus dari user ID ${userId}`]);
            }
        });

        return { success: true, count: success };
    } catch (err) {
        console.error("Blast Engine Error:", err);
        return { success: false, message: err.message };
    }
}

module.exports = { processBlast };
