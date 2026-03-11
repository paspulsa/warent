const { pool } = require('../config/db');

async function executeTransaction(callback) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
    } catch (error) {
        await connection.rollback();
        console.error('⚠️ Transaksi Gagal, Rollback dilakukan untuk mencegah data bocor/rusak:', error);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = { executeTransaction };
