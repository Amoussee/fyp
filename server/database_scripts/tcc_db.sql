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
DROP TABLE IF EXISTS schools CASCADE;

DROP TYPE IF EXISTS user_role_enum CASCADE;

-- 1. Schools
CREATE TABLE IF NOT EXISTS schools (
    school_id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    mrt_desc VARCHAR(255),       -- e.g., "Bishan MRT"
    dgp_code VARCHAR(100),       -- e.g., "BISHAN", "YISHUN"

    mainlevel_code VARCHAR(50),  -- e.g., "PRIMARY", "SECONDARY"
    nature_code VARCHAR(50),     -- e.g., Code for Co-ed/Single sex
    type_code VARCHAR(50),       -- e.g., Code for Govt/Aided/Independent
    zone_code VARCHAR(50),       -- e.g., "NORTH", "EAST"
    status VARCHAR(50),          -- e.g., "Closed", "Merging"

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS
CREATE TYPE user_role_enum AS ENUM ('admin', 'school_staff', 'parent', 'psg_volunteer');

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(school_id) ON DELETE SET NULL,
    cognito_sub VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50), 
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    full_name VARCHAR(255),
    role user_role_enum NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    organisation VARCHAR(255),
    logo_url VARCHAR(255),
    number_child INT DEFAULT 0,
    child_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    last_login TIMESTAMP 
);

-- 3. SURVEYS (QUESTIONS)
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

-- 4. SURVEY RESPONSES
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

-- 5. DASHBOARDS
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

-- 5. SCHOOLS
-- CREATE TABLE IF NOT EXISTS schools (
--     school_id SERIAL PRIMARY KEY,
--     school_name VARCHAR(255) NOT NULL,
--     address VARCHAR(255),
--     mrt_desc VARCHAR(255), -- Nearest MRT station information
--     dgp_code VARCHAR(100), -- Planning area code (YISHUN, BISHAN etc)
--     zone_code VARCHAR(50), -- Educational zone (North, South, etc.)
--     created_at TIMESTAMP DEFAULT NOW()
-- );



-- CREATE TABLE IF NOT EXISTS schools (
--     school_id SERIAL PRIMARY KEY,
--     school_name VARCHAR(255) NOT NULL,
--     address VARCHAR(255),
--     mrt_desc VARCHAR(255),       -- e.g., "Bishan MRT"
--     dgp_code VARCHAR(100),       -- e.g., "BISHAN", "YISHUN"

--     -- The Other Group's MOE Classification Data
--     -- I made these nullable in case you import data that lacks these specific codes initially.
--     mainlevel_code VARCHAR(50),  -- e.g., "PRIMARY", "SECONDARY"
--     nature_code INT,             -- e.g., Code for Co-ed/Single sex
--     type_code INT,               -- e.g., Code for Govt/Aided/Independent
--     status VARCHAR(50),          -- e.g., "Closed", "Merging"

--     -- Conflict Resolution: Zone Code
--     -- They use INT, you use VARCHAR.
--     -- We use VARCHAR(50) here because it is safer: it can store "7" (their INT) AND "NORTH" (your text).
--     zone_code VARCHAR(50),

--     -- Timestamp (Yours)
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- when importing, make sure to put column names as school_name,address,mrt_desc,dgp_code,zone_code
-- FOR MAC USERS type \r in the "Lines terminated with" box instead of auto

-- CREATE TABLE IF NOT EXISTS schools (
--     school_id SERIAL PRIMARY KEY,
--     school_name VARCHAR(255) NOT NULL,
--     address VARCHAR(255),
--     mrt_desc VARCHAR(255),     
--     dgp_code VARCHAR(100),       
--     mainlevel_code VARCHAR(50),  
--     nature_code VARCHAR(50),             
--     type_code VARCHAR(50),  
--     zone_code VARCHAR(50),             
--     status VARCHAR(50),         
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );