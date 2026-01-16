import db from '../config/postgres.js';

export const getAllSchools = async (req, res) => {
    try {
        // Fetch only ID and Name to keep the payload light
        const result = await db.query('SELECT school_id, school_name FROM schools ORDER BY school_name ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching schools:", error);
        res.status(500).json({ error: "Failed to fetch schools" });
    }
};