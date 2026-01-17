import pool from '../config/postgres.js';

// READ (all users - with password)
export const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// READ (all users - without password)
export const getUsersInfo = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, "firstName", "lastName", email, organisation, role, deactivated, created_at FROM users'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// READ (all users - filter by deactivated)
export const getActiveUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE deactivated = false'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// READ (Single User)
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);

        if (result.rows.length === 0) return res.status(404).json({ message: "User not found." });

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST add user (Aligned with your schema)
export const addUser = async (req, res) => {
    const { 
        streetName, // Temporarily used for name since schema requires it
        postalCode, 
        buildingName, 
        unitNumber, 
        numberChild, 
        childDetails 
    } = req.body;

    // These must be provided to satisfy your "NOT NULL" constraints
    const email = `user_${Date.now()}@example.com`; 
    const passwordHash = 'temporary_hash'; 
    const role = 'parent';
    const phoneNumber = '00000000'; // Placeholder for NOT NULL constraint
    const firstName = streetName || 'New';
    const lastName = 'User';

    try {
        const result = await pool.query(
            `INSERT INTO users (
                "firstName", 
                "lastName", 
                email, 
                password_hash, 
                phone_number, 
                organisation, 
                role, 
                "numberChild", 
                "childDetails"
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING user_id`,
            [
                firstName, 
                lastName, 
                email, 
                passwordHash, 
                phoneNumber, 
                buildingName || 'Individual', 
                role, 
                numberChild || 0, 
                JSON.stringify(childDetails) // PostgreSQL JSONB requires stringified array/object
            ]
        );

        res.status(201).json({
            message: 'User onboarded successfully',
            userId: result.rows[0].user_id
        });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// UPDATE User
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, organisation, role, childDetails } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
            SET "firstName" = COALESCE($1, "firstName"), 
                "lastName" = COALESCE($2, "lastName"), 
                organisation = COALESCE($3, organisation), 
                role = COALESCE($4, role),
                "childDetails" = COALESCE($5, "childDetails")
            WHERE user_id = $6`,
            [
                firstName ?? null, 
                lastName ?? null, 
                organisation ?? null, 
                role ?? null, 
                childDetails ? JSON.stringify(childDetails) : null,
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// DELETE User (Hard Delete)
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// DEACTIVATE User (Soft Delete)
export const deactivateUser = async (req, res) => {
    const { id } = req.params; 

    try {
        const result = await pool.query(
            'UPDATE users SET deactivated = TRUE WHERE user_id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deactivated" });
    } catch (error) {
        console.error('Deactivate Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};