// models/survey.model.js
import pool from '../config/postgres.js';

class SurveyModel {
  // 1. Get All
  async findAll() {
    const query = 'SELECT * FROM surveys';
    const { rows } = await pool.query(query);
    return rows;
  }

  // 2. Get by form ID
  async findById(id) {
    const query = 'SELECT * FROM surveys WHERE form_id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  // 3. Create
  async create(data) {
    const { title, description, metadata, schema_json, source_template_id, created_by } = data;
    const query = `
      INSERT INTO surveys (title, description, metadata, schema_json, source_template_id, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [title, description, metadata, schema_json, source_template_id, created_by];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // 4. Update
  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    // Dynamically build the fields and values for the update
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {  // Ensure we only update fields with defined values
        fields.push(`${key} = $${idx}`);
        values.push(value);
        idx++;
      }
    }

    // If no fields are provided for update, return null
    if (fields.length === 0) return null;

    // Add the ID at the end of the values for the WHERE clause
    values.push(id);

    // Construct the query
    const query = `
      UPDATE surveys
      SET ${fields.join(", ")}
      WHERE form_id = $${idx}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];  // Return the updated survey
  }

  // 5. Delete
  async delete(id) {
    const query = 'DELETE FROM surveys WHERE form_id = $1 RETURNING *';
    const { rowCount } = await pool.query(query, [id]);
    return rowCount > 0;
  }
}

export default new SurveyModel();