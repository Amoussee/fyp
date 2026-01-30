// models/survey.model.js
import pool from '../config/postgres.js';

class SurveyModel {
  // 1. Get All
  async findAll(filters = {}) {
    const {userId, status } = filters;

    let query = `
      SELECT form_id, title, description, status, min_responses, created_at, created_by 
      FROM surveys 
      ORDER BY created_at DESC
    `;
    const values = [];
    let paramIndex = 1;

    if (userId) {
      query += ` AND created_by = $${paramIndex}`;
      values.push(userId);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const { rows } = await pool.query(query);
    return rows;
  }

  // 2. Get by form ID
  async findById(surveyId, userId = null) {
    // do a JOIN here to get the list of school_ids associated with this survey
    let query = `
      SELECT s.*, 
             COALESCE(json_agg(sr.school_id) FILTER (WHERE sr.school_id IS NOT NULL), '[]') AS recipients
      FROM surveys s
      LEFT JOIN survey_recipients sr ON s.form_id = sr.survey_id
      WHERE s.form_id = $1
      GROUP BY s.form_id
    `;

    const values = [surveyId];

    if (userId) {
      query += ` AND s.created_by = $2`;
      values.push(userId);
    }

    query += ` GROUP BY s.form_id`;

    const { rows } = await pool.query(query, [surveyId]);
    return rows[0];
  }

  // 3. Get By Status 
  async findByStatus(status) {
    const query = `
      SELECT form_id, title, description, status, min_responses, created_at, created_by 
      FROM surveys 
      WHERE status = $1 
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query, [status]);
    return rows;
  }

  // 4. Create
  async create(data) {
    const { title, description, metadata, schema_json, source_template_id, created_by, status, minResponse, recipients } = data;
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      // insert survey
      const insertSurveyQuery = `
        INSERT INTO surveys (
          title, description, metadata, schema_json, 
          source_template_id, created_by, status, min_responses
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;

      const surveyValues = [title, description, metadata, schema_json, source_template_id, created_by, status || 'draft', minResponse || 0];
      const { rows: surveyRows } = await client.query(insertSurveyQuery, surveyValues);
      const newSurvey = surveyRows[0];

      // insert recipients
      if (recipients && recipients.length > 0) {
        const recipientValues = recipients.map((schoolId) => `(${newSurvey.form_id}, ${schoolId})`).join(',');
        
        const insertRecipientsQuery = `
          INSERT INTO survey_recipients (survey_id, school_id)
          VALUES ${recipientValues}
        `;
        
        await client.query(insertRecipientsQuery);
      }

      await client.query('COMMIT');
      return { ...newSurvey, recipients: recipients || [] };
      
    } catch (error) {
      await client.query('ROLLBACK'); 
      throw error;
    } finally {
      client.release(); 
    }
  }

  // 5. Update
  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    // Map frontend 'minResponse' to database 'min_responses'
    if (data.minResponse !== undefined) {
        data.min_responses = data.minResponse;
        delete data.minResponse;
    }

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

  // 6. Delete
  async delete(id) {
    const query = 'DELETE FROM surveys WHERE form_id = $1 RETURNING *';
    const { rowCount } = await pool.query(query, [id]);
    return rowCount > 0;
  }

  // 7. Check and Promote Status (Open -> Ready)
  async checkAndPromoteStatus(surveyId) {
    const query = `
      UPDATE surveys
      SET status = 'ready'
      WHERE form_id = $1
        AND status = 'open'
        AND (
          SELECT COUNT(*) 
          FROM survey_responses 
          WHERE form_id = $1
        ) >= min_responses
      RETURNING *;
    `;
    
    const { rows } = await pool.query(query, [surveyId]);
    return rows[0] || null;
  }
}

export default new SurveyModel();