import pool from '../config/postgres.js';

class SurveyTemplateModel {
  // Get all survey templates
  async findAll() {
    const query = `
      SELECT *
      FROM survey_templates
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  // Get a single survey template by ID
  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM survey_templates WHERE template_id = $1', [id]);
    return rows[0];
  }

  // Create a new survey template
  async create(data) {
    const { title, description, schema_json, metadata, created_by } = data;

    const query = `
      INSERT INTO survey_templates (
        title, description, schema_json, metadata, owner_id
      ) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *;
    `;

    const values = [title, description, schema_json, metadata || '{}', created_by];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Update an existing survey template by ID
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
      UPDATE survey_templates
      SET ${fields.join(', ')}
      WHERE template_id = $${placeholderIndex}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Delete a survey template by ID
  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM survey_templates WHERE template_id = $1 RETURNING *',
      [id],
    );
    return rowCount > 0;
  }
}

export default new SurveyTemplateModel();
