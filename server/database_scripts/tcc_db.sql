-- -- 1. Create the database if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS tcc_db;

-- -- 2. Switch to using that database
-- USE tcc_db;

-- 3. Create your tables (Example: Users table)
-- SAFE RESET (for development only)
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS dashboards CASCADE;
DROP TABLE IF EXISTS surveys CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    organisation VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    deactivated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. SURVEYS (QUESTIONS)
CREATE TABLE IF NOT EXISTS surveys (
    form_id SERIAL PRIMARY KEY,
    metadata JSONB NOT NULL,
    schema_json JSONB NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_surveys_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- 3. SURVEY RESPONSES
CREATE TABLE IF NOT EXISTS survey_responses (
    response_id SERIAL PRIMARY KEY,
    form_id INT NOT NULL,
    responses JSONB NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_responses_form
        FOREIGN KEY (form_id)
        REFERENCES surveys(form_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_responses_user
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- 4. DASHBOARDS
CREATE TABLE IF NOT EXISTS dashboards (
    dashboard_id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_dashboard_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);