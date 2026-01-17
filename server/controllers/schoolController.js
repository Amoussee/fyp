import pool from '../config/postgres.js';

export const getAllSchools = async (req, res) => {
  try {
    // Fetch only ID and Name to keep the payload light
    const result = await pool.query(
      'SELECT school_id, school_name FROM schools ORDER BY school_name ASC',
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Failed to fetch schools' });
  }
};

// GET school by name
export const getSchoolByName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await pool.query('SELECT * FROM schools WHERE school_name = $1', [name]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'School not found.' });

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching school by name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
