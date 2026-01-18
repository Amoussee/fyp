import pool from '../config/postgres.js';

export const getAllSchools = async (req, res) => {
    try {
        // Fetch only ID and Name to keep the payload light
        const result = await pool.query('SELECT * FROM schools ORDER BY school_name ASC');
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
        const result = await pool.query('SELECT * FROM schools WHERE school_id = $1', [id])

        if (result.rows.length === 0) return res.status(404).json({ message: "School not found." });

        res.status(200).json(result.rows);
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
        zone_code,
        mainlevel_code,
        nature_code,
        type_code
    } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO schools (
                school_name,
                address,
                mrt_desc,
                dgp_code,
                zone_code,
                mainlevel_code,
                nature_code,
                type_code
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            `,
            [
                school_name, 
                address, 
                mrt_desc, 
                dgp_code, 
                zone_code, 
                mainlevel_code, 
                nature_code, 
                type_code
            ]
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
        zone_code,
        mainlevel_code,
        nature_code,
        type_code
    } = req.body;

    try {
        const result = await pool.query(
            `
            UPDATE schools
            SET
                school_name    = COALESCE($1, school_name),
                address        = COALESCE($2, address),
                mrt_desc       = COALESCE($3, mrt_desc),
                dgp_code       = COALESCE($4, dgp_code),
                zone_code      = COALESCE($5, zone_code),
                mainlevel_code = COALESCE($6, mainlevel_code),
                nature_code    = COALESCE($7, nature_code),
                type_code      = COALESCE($8, type_code)
            WHERE school_id = $9
            RETURNING *
            `,
            [
                school_name,
                address,
                mrt_desc,
                dgp_code,
                zone_code,
                mainlevel_code,
                nature_code,
                type_code,
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

// DELETE delete school
export const deleteSchool = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM schools WHERE school_id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.status(200).json({
            message: 'School deleted successfully',
            deletedSchool: result.rows[0]
        });
    } catch (error) {
        console.error('Delete school error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// PATCH update school status
export const updateSchoolStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // e.g., "Active", "Inactive", "Closed"

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const result = await pool.query(
            `UPDATE schools SET status = $1 WHERE school_id = $2 RETURNING *`,
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.status(200).json({
            message: `School status updated to ${status}`,
            school: result.rows[0]
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
