import db from '../config/db.js';


// READ (all users - without password)
export const getUsers = async (req, res) => {
    try {
        // TODO: need to change select columns
        const [rows] = await db.query('SELECT * FROM users');
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error:'Internal Server Error'});
    }
};

// READ (all users - filter by deactivated)

// READ (Single User)
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);

        if (rows.length === 0) return res.status(404).json({ message: "User not found." });

        res.status(200).json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ error:'Internal Server Error'});
    }
}