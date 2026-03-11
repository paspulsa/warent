// File: services/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initSession } = require('./whatsappManager');
const { query } = require('../config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // Izinkan akses dari frontend Next.js
});

io.on('connection', (socket) => {
    // Member minta inisialisasi (QR atau Pairing)
    socket.on('request-session', async ({ clientId, phoneNumber, method }) => {
        if (method === 'pairing') {
            await initSession(clientId, io, phoneNumber);
        } else {
            await initSession(clientId, io);
        }
    });
});

// AUTO RESUME: Connect kembali akun yang statusnya 'Connected' di DB
async function resumeSessions() {
    try {
        const activeAccs = await query('SELECT client_id FROM whatsapp_accounts WHERE status = "Connected"');
        console.log(`[SYSTEM] Resuming ${activeAccs.length} sessions...`);
        for (const acc of activeAccs) {
            initSession(acc.client_id, io);
        }
    } catch (err) {
        console.error("Resume Error:", err);
    }
}

const PORT = 5000;
server.listen(PORT, async () => {
    console.log(`🚀 WA Blast Worker running on port ${PORT}`);
    await resumeSessions();
});
