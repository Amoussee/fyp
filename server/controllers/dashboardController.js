import pool from '../config/postgres.js';

// 1. GET ALL DASHBOARDS FOR A USER (via owner_id or sub)
export const getDashboards = async (req, res) => {
  const { owner_id, sub, email } = req.query;

  if (!owner_id && !sub && !email) {
    return res.status(400).json({ error: 'owner_id, sub, or email is required' });
  }

  try {
    let final_owner_id = owner_id;

    // If email is provided, lookup by email
    if (email) {
      const userRes = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
      if (userRes.rows.length === 0) {
        return res.status(200).json([]);
      }
      final_owner_id = userRes.rows[0].user_id;
    }
    // Fallback: If sub is provided, try to find user by cognito_sub OR generic lookup strategy
    else if (sub) {
      // Try cognito_sub first (legacy support), or maybe the sub IS the email?
      // Let's try both to be robust if the user passes email as sub
      const userRes = await pool.query(
        'SELECT user_id FROM users WHERE cognito_sub = $1 OR email = $1',
        [sub],
      );
      if (userRes.rows.length === 0) {
        return res.status(200).json([]);
      }
      final_owner_id = userRes.rows[0].user_id;
    }

    const result = await pool.query(
      'SELECT * FROM dashboards WHERE owner_id = $1 ORDER BY created_at DESC',
      [final_owner_id],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error retrieving dashboards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 2. GET SINGLE DASHBOARD
export const getDashboardById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM dashboards WHERE dashboard_id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Dashboard not found.' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('getDashboardById error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 3. UPSERT DASHBOARD
export const upsertDashboard = async (req, res) => {
  const { dashboard_id, owner_id, sub, email, name, config, layoutType, widgets } = req.body;

  // We need name and some way to identify the owner
  if (!name || (!owner_id && !sub && !email)) {
    return res
      .status(400)
      .json({ error: 'Missing required fields: name AND (owner_id OR sub OR email)' });
  }

  // Build the config object if widgets/layoutType are passed separately
  const finalConfig = config || { layoutType, widgets };

  try {
    let final_owner_id = owner_id;

    const lookupValue = email || sub;

    if (lookupValue && !owner_id) {
      const userRes = await pool.query(
        'SELECT user_id FROM users WHERE email = $1 OR cognito_sub = $1',
        [lookupValue],
      );

      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      final_owner_id = userRes.rows[0].user_id;
    }

    let result;
    // If we have a numeric dashboard_id, try update
    if (dashboard_id && !isNaN(dashboard_id)) {
      result = await pool.query(
        `UPDATE dashboards 
                 SET name = $1, config = $2 
                 WHERE dashboard_id = $3 AND owner_id = $4 
                 RETURNING *`,
        [name, JSON.stringify(finalConfig), dashboard_id, final_owner_id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Dashboard not found or unauthorized' });
      }
    } else {
      // Create new
      result = await pool.query(
        `INSERT INTO dashboards (owner_id, name, config) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
        [final_owner_id, name, JSON.stringify(finalConfig)],
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error upserting dashboard:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 4. DELETE DASHBOARD
export const deleteDashboard = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM dashboards WHERE dashboard_id = $1 RETURNING *', [
      id,
    ]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Dashboard not found' });
    res.status(200).json({ message: 'Dashboard deleted successfully' });
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
