import pool from '../config/postgres.js';

// 1. GET ALL USERS
export const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 2. GET USERS INFO (Public details)
export const getUsersInfo = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, "firstName", "lastName", email, organisation, role, deactivated FROM users'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 3. GET ACTIVE USERS
export const getActiveUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE deactivated = false');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 4. GET SINGLE USER
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

// 5. POST ADD USER (Strict Schema Match)
export const addUser = async (req, res) => {
    const { streetName, buildingName, numberChild, childDetails } = req.body;

    // Default values for NOT NULL columns
    const firstname = streetName || "New"; // Changed to lowercase
    const lastname = "User";               // Changed to lowercase
    const email = `user_${Date.now()}@example.com`;
    const password_hash = "temporary_hash";
    const phone_number = "00000000"; 
    const role = "parent";
    const numberchild = numberChild || 0;  // Changed to lowercase

    try {
        const result = await pool.query(
            `INSERT INTO users (
                firstname, 
                lastname, 
                email, 
                password_hash, 
                phone_number, 
                organisation, 
                role, 
                numberchild, 
                childdetails
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING user_id`,
            [
                firstname,
                lastname,
                email,
                password_hash,
                phone_number,
                buildingName || 'Individual',
                role,
                numberchild,
                JSON.stringify(childDetails || []) // Postgres needs JSONB as a string
            ]
        );

        res.status(201).json({
            message: 'User created successfully',
            userId: result.rows[0].user_id
        });
    } catch (error) {
        console.error('Database Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// 6. UPDATE USER
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, organisation, role, childDetails } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users SET 
                "firstName" = COALESCE($1, "firstName"), 
                "lastName" = COALESCE($2, "lastName"), 
                organisation = COALESCE($3, organisation), 
                role = COALESCE($4, role),
                "childDetails" = COALESCE($5, "childDetails")
            WHERE user_id = $6`,
            [firstName, lastName, organisation, role, JSON.stringify(childDetails), id]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 7. DELETE USER
export const deleteUser = async (req, res) => {
    const { id } = req.params; // This gets the ID from the URL
    try {
        const result = await pool.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING *', 
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: `User with ID ${id} deleted successfully`,
            deletedUser: result.rows[0] 
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 8. DEACTIVATE USER (Soft Delete)
export const deactivateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('UPDATE users SET deactivated = TRUE WHERE user_id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deactivated" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};