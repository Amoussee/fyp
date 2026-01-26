import pool from '../config/postgres.js';

class UserModel {
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows;
  }

  async findPublicInfo() {
    const { rows } = await pool.query(
      `SELECT 
        user_id,
        first_name,
        last_name,
        full_name,
        email,
        organisation,
        role,
        is_active,
        number_child,
        child_details,
        school_id
       FROM users`,
    );
    return rows;
  }

  async findActive() {
    const { rows } = await pool.query('SELECT * FROM users WHERE is_active = TRUE');
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    return rows[0];
  }

  async create(data) {
    const {
      first_name,
      last_name,
      full_name,
      email,
      phone_number,
      organisation,
      role,
      number_child,
      child_details,
      school_id,
    } = data;

    const { rows } = await pool.query(
      `
      INSERT INTO users (
        first_name,
        last_name,
        full_name,
        email,
        phone_number,
        is_active,
        organisation,
        role,
        number_child,
        child_details,
        school_id
      )
      VALUES ($1, $2, $3, $4, $5, true, $6, $7, $8, $9, $10)
      RETURNING user_id
      `,
      [
        first_name,
        last_name,
        full_name,
        email,
        phone_number,
        organisation,
        role,
        number_child,
        JSON.stringify(child_details),
        school_id,
      ],
    );

    return rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let placeholderIndex = 1;

    // Iterate through the data object to build the query dynamically
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = $${placeholderIndex}`);
        values.push(value);
        placeholderIndex++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(', ')} 
      WHERE user_id = $${placeholderIndex} 
      RETURNING *`;

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
    return rowCount > 0;
  }

  async deactivate(id) {
    const { rows } = await pool.query(
      `
      UPDATE users
      SET is_active = FALSE
      WHERE user_id = $1
      RETURNING *
      `,
      [id],
    );

    return rows[0];
  }
}

export default new UserModel();
