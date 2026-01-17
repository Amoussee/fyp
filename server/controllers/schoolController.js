import pool from '../config/postgres.js';

export const getAllSchools = async (req, res) => {
    try {
        // Fetch only ID and Name to keep the payload light
        const result = await pool.query('SELECT school_id, school_name FROM schools ORDER BY school_name ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching schools:", error);
        res.status(500).json({ error: "Failed to fetch schools" });
    }
};

// GET school by name
export const getSchoolByName = async (req, res) => {
    const { name } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM schools WHERE school_name ILIKE $1', 
            [`%${name}%`] 
        );

        if (result.rows.length === 0) return res.status(404).json({ message: "School not found." });

        // return the first object
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error:'Internal Server Error'});
    }
}

// GET school by id
export const getSchoolById = async (req, res) => {
    const { id } = req.params;

    try {
        const result =  pool.query('SELECT * FROM schools WHERE school_id = $1', [id])

        if (result.rows.length === 0) return res.status(404).json({ message: "School not found." });

        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// POST add school
export const addSchool = async (req, res) => {
    const {
        school_name,
        address,
        mrt_desc,
        dgp_code,
        zone_code
    } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO schools (
                school_name,
                address,
                mrt_desc,
                dgp_code,
                zone_code
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [school_name, address, mrt_desc, dgp_code, zone_code]
        );

        res.status(201).json({
            message: 'School added successfully',
            school: result.rows[0]
        });
    } catch (error) {
        console.error('Add school error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// PUT update school
export const updateSchool = async (req, res) => {
    const { id } = req.params;
    const {
        school_name,
        address,
        mrt_desc,
        dgp_code,
        zone_code
    } = req.body;

    try {
        const result = await pool.query(
            `
            UPDATE schools
            SET
                school_name = COALESCE($1, school_name),
                address     = COALESCE($2, address),
                mrt_desc    = COALESCE($3, mrt_desc),
                dgp_code    = COALESCE($4, dgp_code),
                zone_code   = COALESCE($5, zone_code)
            WHERE school_id = $6
            RETURNING *
            `,
            [
                school_name,
                address,
                mrt_desc,
                dgp_code,
                zone_code,
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.status(200).json({
            message: 'School updated successfully',
            school: result.rows[0]
        });
    } catch (error) {
        console.error('Update school error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



