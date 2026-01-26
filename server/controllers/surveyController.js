import pool from '../config/postgres.js';

// 1. GET ALL SURVEYS
export const getSurveys = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching surveys:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 2. GET SINGLE SURVEY
export const getSurveyById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM surveys WHERE form_id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Survey not found' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 3. CREATE SURVEY
export const createSurvey = async (req, res) => {
    const { metadata, schema_json, created_by } = req.body;

    if (!metadata || !schema_json || !created_by) {
        return res.status(400).json({ error: 'Missing required fields: metadata, schema_json, created_by' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO surveys (metadata, schema_json, created_by) VALUES ($1, $2, $3) RETURNING *',
            [JSON.stringify(metadata), JSON.stringify(schema_json), created_by]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating survey:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 4. GET RESPONSES FOR A SURVEY
export const getResponsesBySurveyId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM survey_responses WHERE form_id = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 5. SUBMIT A RESPONSE
export const submitResponse = async (req, res) => {
    const { form_id, responses, created_by } = req.body;

    if (!form_id || !responses || !created_by) {
        return res.status(400).json({ error: 'Missing required fields: form_id, responses, created_by' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO survey_responses (form_id, responses, created_by) VALUES ($1, $2, $3) RETURNING *',
            [form_id, JSON.stringify(responses), created_by]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error submitting response:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
