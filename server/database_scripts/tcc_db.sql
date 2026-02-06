-- SAFE RESET (for development only)
DROP TABLE IF EXISTS survey_templates CASCADE;
DROP TABLE IF EXISTS survey_recipients CASCADE;
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS dashboards CASCADE;
DROP TABLE IF EXISTS surveys CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS schools CASCADE;

DROP TYPE IF EXISTS survey_status_enum CASCADE;
DROP TYPE IF EXISTS user_role_enum CASCADE;
DROP TYPE IF EXISTS survey_scope CASCADE;

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
    is_cooperating boolean DEFAULT FALSE, -- whether the school is cooperating with tcc         
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_school_name UNIQUE (school_name)
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
    logo_url VARCHAR(255),
    number_child INT DEFAULT 0,
    child_details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    last_login TIMESTAMP 
);

-- 3. SURVEY TEMPLATES
CREATE TABLE IF NOT EXISTS survey_templates (
    template_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    -- core data needed to recreate a survey
    schema_json JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',

    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_templates_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- 4. SURVEYS (QUESTIONS)
CREATE TYPE survey_scope AS ENUM ('PUBLIC', 'AUTHENTICATED');
CREATE TYPE survey_status_enum AS ENUM ('draft', 'open', 'ready', 'closed');

CREATE TABLE IF NOT EXISTS surveys (
    form_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL, -- added title 
    description TEXT,            -- added optional description
    source_template_id INT,      -- added source_template_id to reference survey_templates
    survey_type survey_scope NOT NULL DEFAULT 'AUTHENTICATED', -- added to distinguish between public and private surveys
    status survey_status_enum NOT NULL DEFAULT 'draft', -- added to distinguish survey statuses
    min_responses INT NOT NULL DEFAULT 0 CHECK (min_responses >= 0),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    schema_json JSONB NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_surveys_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_surveys_template
        FOREIGN KEY (source_template_id)
        REFERENCES survey_templates(template_id)
        ON DELETE SET NULL
);

-- 5. SURVEY RECIPIENTS
CREATE TABLE IF NOT EXISTS survey_recipients (
    survey_id INT NOT NULL,
    school_id INT NOT NULL,
    PRIMARY KEY (survey_id, school_id),
    
    CONSTRAINT fk_recipient_survey
        FOREIGN KEY (survey_id)
        REFERENCES surveys(form_id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_recipient_school
        FOREIGN KEY (school_id)
        REFERENCES schools(school_id)
        ON DELETE CASCADE
);

-- 6. SURVEY RESPONSES
CREATE TABLE IF NOT EXISTS survey_responses (
    response_id SERIAL PRIMARY KEY,
    form_id INT NOT NULL,
    responses JSONB NOT NULL,
    user_id INT, -- renamed from created_by to user_id and removed 'NOT NULL' so that public users can submit
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_responses_form
        FOREIGN KEY (form_id)
        REFERENCES surveys(form_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_responses_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

-- 7. DASHBOARDS
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
