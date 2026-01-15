CREATE TABLE IF NOT EXISTS schools (
    school_id INT AUTO_INCREMENT PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    mrt_desc VARCHAR(255), -- Nearest MRT station information
    dgp_code VARCHAR(100), -- Planning area code (YISHUN, BISHAN etc)
    zone_code VARCHAR(50), -- Educational zone (North, South, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- when importing, make sure to put column names as school_name,address,mrt_desc,dgp_code,zone_code
-- FOR MAC USERS type \r in the "Lines terminated with" box instead of auto