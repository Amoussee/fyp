// models/survey.model.js
import pool from '../config/postgres.js';

class SurveyModel {
  // 1. Get All
  async findAll() {
    const query = 'SELECT * FROM surveys ORDER BY created_at DESC';
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
    const { title, description, source_template_id, survey_type, metadata, schema_json, created_by } = data;
    const query = `
      INSERT INTO surveys (title, description, source_template_id, survey_type, metadata, schema_json, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    const values = [title, description, source_template_id, survey_type, metadata, schema_json, created_by];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // 4. Update
  async update(id, data) {
    const query = `
      UPDATE surveys 
      SET title = $1, description = $2, survey_type = $3, metadata = $4, schema_json = $5
      WHERE form_id = $6
      RETURNING *`;
    const values = [data.title, data.description, data.survey_type, data.metadata, data.schema_json, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // 5. Delete
  async delete(id) {
    const query = 'DELETE FROM surveys WHERE form_id = $1 RETURNING *';
    const { rowCount } = await pool.query(query, [id]);
    return rowCount > 0;
  }
}

export default new SurveyModel();