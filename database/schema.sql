CREATE DATABASE IF NOT EXISTS rent_wa_blast;
USE rent_wa_blast;

-- 1. Tabel Users (Admin & Member)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    referral_code VARCHAR(50) UNIQUE,
    referred_by INT DEFAULT NULL,
    bank_name ENUM('Dana', 'Gopay', 'BCA', 'Seabank') DEFAULT NULL,
    bank_account_number VARCHAR(50) DEFAULT NULL,
    bank_account_name VARCHAR(100) DEFAULT NULL,
    wallet_balance DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (referred_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 2. Tabel Akun WhatsApp Member
CREATE TABLE IF NOT EXISTS whatsapp_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    client_id VARCHAR(150) UNIQUE NOT NULL,
    status ENUM('Connected', 'Disconnected', 'Conflict', 'Logged Out') DEFAULT 'Disconnected',
    total_sent INT DEFAULT 0,
    total_failed INT DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0.00,
    qr_code TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tabel Materi Iklan (Diinput Admin)
CREATE TABLE IF NOT EXISTS advertisements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message_content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Tabel Kontak Target (Diinput Admin)
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Tabel Riwayat Blast
CREATE TABLE IF NOT EXISTS blasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    whatsapp_account_id INT NOT NULL,
    status ENUM('Pending', 'Running', 'Completed', 'Failed') DEFAULT 'Pending',
    total_target INT NOT NULL,
    success_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (whatsapp_account_id) REFERENCES whatsapp_accounts(id) ON DELETE CASCADE
);

-- 6. Tabel Transaksi (Wallet & Referral)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    whatsapp_account_id INT DEFAULT NULL,
    transaction_type ENUM('Blast_Reward', 'Referral_Bonus', 'Withdrawal', 'Bonus', 'System_Adjustment') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (whatsapp_account_id) REFERENCES whatsapp_accounts(id) ON DELETE SET NULL
);

-- 7. Tabel Penarikan Dana
CREATE TABLE IF NOT EXISTS withdrawals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    bank_name ENUM('Dana', 'Gopay', 'BCA', 'Seabank') NOT NULL,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_account_name VARCHAR(100) NOT NULL,
    status ENUM('Pending', 'Processing', 'Accepted', 'Rejected') DEFAULT 'Pending',
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Tabel Pengaturan Komisi
CREATE TABLE IF NOT EXISTS app_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value VARCHAR(255) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Data Default Pengaturan
INSERT IGNORE INTO app_settings (setting_key, setting_value, description) VALUES 
('blast_commission', '500', 'Nominal komisi user per klik Mulai Blast'),
('referral_blast_commission', '100', 'Nominal komisi referral per blast bawahan');
