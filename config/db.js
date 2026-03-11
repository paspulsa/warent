const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rent_wa_blast',
    waitForConnections: true,
    connectionLimit: 50,
    maxIdle: 50,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

async function query(sql, params = []) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results, ] = await connection.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database Query Error: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Berhasil terhubung ke database MySQL.');
        connection.release();
    } catch (error) {
        console.error('❌ Gagal terhubung ke database:', error.message);
        process.exit(1);
    }
}

module.exports = { pool, query, testConnection };
