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
        email,
        organisation,
        role,
        is_active
       FROM users`
    );
    return rows;
  }

  async findActive() {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE is_active = TRUE'
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE user_id = $1',
      [id]
    );
    return rows[0];
  }

  async create(data) {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      role,
      organisation,
      number_child = 0,
      child_details = [],
    } = data;

    const { rows } = await pool.query(
      `
      INSERT INTO users (
        first_name,
        last_name,
        email,
        phone_number,
        role,
        organisation,
        number_child,
        child_details
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING user_id
      `,
      [
        first_name,
        last_name,
        email,
        phone_number,
        role,
        organisation,
        number_child,
        JSON.stringify(child_details),
      ]
    );

    return rows[0];
  }

  async update(id, data) {
    const {
      first_name,
      last_name,
      phone_number,
      is_active,
      number_child,
      child_details,
    } = data;

    const { rows } = await pool.query(
      `
      UPDATE users
      SET
        first_name   = COALESCE($1, first_name),
        last_name    = COALESCE($2, last_name),
        phone_number = COALESCE($3, phone_number),
        is_active    = COALESCE($4, is_active),
        number_child = COALESCE($5, number_child),
        child_details= COALESCE($6, child_details)
      WHERE user_id = $7
      RETURNING *
      `,
      [
        first_name,
        last_name,
        phone_number,
        is_active,
        number_child,
        child_details,
        id,
      ]
    );

    return rows[0];
  }

  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM users WHERE user_id = $1',
      [id]
    );
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
      [id]
    );

    return rows[0];
  }
}

export default new UserModel();
