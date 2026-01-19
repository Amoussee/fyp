import pool from '../config/postgres.js';

// 1. GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 2. GET USERS INFO (Public details)
export const getUsersInfo = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, "firstName", "lastName", email, organisation, role, is_active FROM users'
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
        const result = await pool.query('SELECT * FROM users WHERE is_active = true');
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
    // Destructure directly using the new snake_case names from req.body
    const { 
        first_name, 
        last_name, 
        email, 
        phone_number, 
        role, 
        organisation, 
        number_child, 
        child_details 
    } = req.body;

    // const password_hash = "temporary_hash"; // Usually handled by Auth logic later

    try {
        const result = await pool.query(
            `INSERT INTO users (
                first_name, 
                last_name, 
                email, 
                phone_number, 
                role, 
                organisation, 
                number_child, 
                child_details
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING user_id`,
            [
                first_name,
                last_name,
                email,
                phone_number,
                role, // MUST match your user_role_enum values exactly
                organisation,
                number_child || 0,
                JSON.stringify(child_details || [])
            ]
        );

        res.status(201).json({
            message: 'User created successfully',
            user_id: result.rows[0].user_id
        });
    } catch (error) {
        console.error('DB Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// 6. UPDATE USER
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone_number, is_active, number_child, child_details } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
            SET first_name = COALESCE($1, first_name), 
                last_name = COALESCE($2, last_name), 
                phone_number = COALESCE($3, phone_number),
                is_active = COALESCE($4, is_active),
                number_child = COALESCE($5, number_child),
                child_details = COALESCE($6, child_details)
            WHERE user_id = $7 
            RETURNING *`,
            [first_name, last_name, phone_number, is_active, number_child, child_details, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json({ message: 'User updated successfully' });
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
        const result = await pool.query('UPDATE users SET is_active = FALSE WHERE user_id = $1', [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deactivated" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json({ message: 'User deactivated' });
  } catch (error) {
    console.error('Deactivate Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
