import pool from '../config/postgres.js';

// READ (all users - with password)
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// READ (all users - without password)
export const getUsersInfo = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT user_id, email, name, organisation, role, deactivated, created_at FROM users',
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// READ (all users - filter by deactivated)
export const getActiveUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, email, name, organisation, role, deactivated, created_at 
            FROM users WHERE deactivated=false`,
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving active users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// READ (Single User)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving user by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST add user
export const addUser = async (req, res) => {
  const { streetName, postalCode, buildingName, unitNumber, numberChild, childDetails } = req.body;

  // For onboarding, we'll need a default email/password or handle them from the form
  // I'll use placeholders for email/password since they aren't in your current UI
  const email = `user_${Date.now()}@example.com`;
  const passwordHash = 'temporary_hash';
  const role = 'parent';

  try {
    // We store the specific onboarding details in the JSON 'profile_data' column
    const profileData = JSON.stringify({
      address: { streetName, postalCode, buildingName, unitNumber },
      family: { numberChild, childDetails },
    });

    const result = await pool.query(
      // 'INSERT INTO users (email, name, organisation, password_hash, role, profile_data) VALUES (?, ?, ?, ?, ?, ?)', // this line has profile data so i commented it out for now
      `
            INSERT INTO users (email, name, organisation, password_hash, role) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id
            `,

      [email, streetName, buildingName || 'Individual', passwordHash, role, profileData],
    );

    res.status(201).json({
      message: 'User onboarded successfully',
      userId: result.rows[0].user_id,
    });
  } catch (error) {
    console.error('Error onboarding user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// UPDATE User
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, organisation, role } = req.body; // removing profile_data for now since unused!
//   const { name, organisation, role, profile_data } = req.body;

  try {
    // We use COALESCE so that if a field isn't provided in req.body, it keeps its old value
    const result = await pool.query(
      `
            UPDATE users 
            SET name = COALESCE($1, name), 
                organisation = COALESCE($2, organisation), 
                role = COALESCE($3, role),
                profile_data = COALESCE($4, profile_data)
            WHERE user_id = $4`,
      [
        name ?? null,
        organisation ?? null,
        role ?? null,
        // profile_data ? JSON.stringify(profile_data) : null,
        id,
      ],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE User (Hard Delete)
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE user_id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DEACTIVATE User (Soft Delete - Recommended for FYP by my boy gemini)
export const deactivateUser = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  try {
    const result = await pool.query('UPDATE users SET deactivated = TRUE WHERE user_id = $1', [
      user_id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deactivated' });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
