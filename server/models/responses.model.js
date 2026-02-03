// models/responses.model.js
import pool from '../config/postgres.js';

class SurveyResponseModel {
  // 1. Create
  async create(data) {
    const { form_id, responses, user_id } = data;
    const query = `
            INSERT INTO survey_responses (form_id, responses, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
    const values = [form_id, responses, user_id || null];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // 2. GET all responses by form_id
  async findByFormId(formId) {
    const query = `
        SELECT 
            sr.*, 
            u.user_id, 
            u.role, 
            u.organisation
        FROM survey_responses sr
        JOIN users u ON sr.user_id = u.user_id
        WHERE sr.form_id = $1
        `;

    const { rows } = await pool.query(query, [formId]);
    return rows;
  }

  // Find a specific response by ID and join user data
  async findById(id) {
    const query = `
        SELECT 
            sr.*, 
            u.user_id, 
            u.role, 
            u.organisation
        FROM survey_responses sr
        JOIN users u ON sr.user_id = u.user_id
        WHERE sr.response_id = $1
        `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  // Delete a response
  async delete(id) {
    const query = 'DELETE FROM survey_responses WHERE response_id = $1 RETURNING *';
    const { rowCount } = await pool.query(query, [id]);
    return rowCount > 0;
  }

  // Delete responses by FormId
  async deleteByFormId(formId) {
    const query = 'DELETE FROM survey_responses WHERE form_id = $1 RETURNING *';
    const { rowCount } = await pool.query(query, [formId]);
    return rowCount > 0;
  }
}

export default new SurveyResponseModel();
