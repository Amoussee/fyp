import db from '../config/db.js';

export const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error:'Internal Server Error'});
    }
};