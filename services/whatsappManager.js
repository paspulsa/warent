// File: services/whatsappManager.js
const { 
    makeWASocket, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion 
} = require('@whiskeysockets/baileys');
const { query } = require('../config/db');
const fs = require('fs');

// Simpan session aktif di memory agar bisa diakses Blast Engine
const sessions = new Map();

async function initSession(clientId, io, phoneNumber = null) {
    const sessionDir = `./sessions/${clientId}`;
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        browser: ["WA Blast Pro", "Chrome", "1.0.0"],
    });

    // Simpan ke memory
    sessions.set(clientId, sock);

    // Handler untuk Pairing Code
    if (phoneNumber && !state.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(phoneNumber.replace(/\D/g, ''));
                io.emit(`pairing-${clientId}`, code);
            } catch (err) {
                console.error("Pairing Error:", err);
            }
        }, 3000);
    }

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) io.emit(`qr-${clientId}`, qr);

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                initSession(clientId, io);
            } else {
                // Jika user logout, hapus folder sesi
                fs.rmSync(sessionDir, { recursive: true, force: true });
                sessions.delete(clientId);
                await query('UPDATE whatsapp_accounts SET status = "Disconnected" WHERE client_id = ?', [clientId]);
            }
        } else if (connection === 'open') {
            const phone = sock.user.id.split(':')[0];
            await query(
                'UPDATE whatsapp_accounts SET status = "Connected", phone_number = ? WHERE client_id = ?', 
                [phone, clientId]
            );
            io.emit(`status-${clientId}`, 'Connected');
        }
    });

    sock.ev.on('creds.update', saveCreds);
    return sock;
}

const getSocketByClientId = (clientId) => sessions.get(clientId);

module.exports = { initSession, getSocketByClientId };
