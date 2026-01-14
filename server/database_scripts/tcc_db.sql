-- 1. Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tcc_db;

-- 2. Switch to using that database
USE tcc_db;

-- 3. Create your tables (Example: Users table)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password)
VALUES 
('cedric', 'cedric@example.com', 'password'),
('jane', 'jane@example.com', 'password')
ON DUPLICATE KEY UPDATE email=email;