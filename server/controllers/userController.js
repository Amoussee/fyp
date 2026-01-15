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
export const getActiveUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE deactivated=false');
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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

// POST add user
export const addUser = async (req, res) => {
    const { 
        streetName, postalCode, buildingName, unitNumber, 
        numberChild, childDetails 
    } = req.body;

    // For onboarding, we'll need a default email/password or handle them from the form
    // I'll use placeholders for email/password since they aren't in your current UI
    const email = `user_${Date.now()}@example.com`; 
    const passwordHash = 'temporary_hash'; 
    const role = 'parent';

    try {
        // We store the specific onboarding details in the JSON 'profile_data' column
        const profileData = JSON.stringify({
            address: { streetName, postalCode, buildingName, unitNumber },
            family: { numberChild, childDetails }
        });

        const [result] = await db.query(
            // 'INSERT INTO users (email, name, organisation, password_hash, role, profile_data) VALUES (?, ?, ?, ?, ?, ?)', // this line has profile data so i commented it out for now
            'INSERT INTO users (email, name, organisation, password_hash, role) VALUES (?, ?, ?, ?, ?)',

            [email, streetName, buildingName || 'Individual', passwordHash, role, profileData]
        );

        res.status(201).json({
            message: 'User onboarded successfully',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// UPDATE User
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, organisation, role, profile_data } = req.body;

    try {
        // We use COALESCE so that if a field isn't provided in req.body, it keeps its old value
        const query = `
            UPDATE users 
            SET name = COALESCE(?, name), 
                organisation = COALESCE(?, organisation), 
                role = COALESCE(?, role),
                profile_data = COALESCE(?, profile_data)
            WHERE user_id = ?`;

        const [result] = await db.query(query, [
            name, 
            organisation, 
            role, 
            profile_data ? JSON.stringify(profile_data) : null, 
            id
        ]);

        if (result.affectedRows === 0) {
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
        const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// DEACTIVATE User (Soft Delete - Recommended for FYP by my boy gemini)
export const deactivateUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE users SET deactivated = TRUE WHERE user_id = ?', [id]);
        res.status(200).json({ message: "User deactivated" });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};