import pool from '../config/postgres.js';

class SchoolModel {
    async findAll() {
        const { rows } = await pool.query('SELECT * FROM schools ORDER BY school_name ASC');
        return rows;
    }

    async findById(id) {
        const { rows } = await pool.query('SELECT * FROM schools WHERE school_id = $1', [id]);
        return rows[0];
    }

    async search(filters) {
        const conditions = [];
        const values = [];
        let index = 1;

        if (filters.school_name) {
            conditions.push(`school_name ILIKE $${index++}`);
            values.push(`%${filters.school_name}%`);
        }

        if (filters.zone_code) {
            conditions.push(`zone_code = $${index++}`);
            values.push(filters.zone_code);
        }

        if (filters.status) {
            conditions.push(`status = $${index++}`);
            values.push(filters.status);
        }

        if (filters.type_code) {
            conditions.push(`type_code = $${index++}`);
            values.push(filters.type_code);
        }

        const whereClause =
            conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const query = `
    SELECT *
    FROM schools
    ${whereClause}
    ORDER BY school_name ASC
  `;

        const { rows } = await pool.query(query, values);
        return rows;
    }


    async create(data) {
        const fields = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const query = `INSERT INTO schools (${fields}) VALUES (${placeholders}) RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async update(id, data) {
        const fields = [];
        const values = [];
        let placeholderIndex = 1;

        for (const [key, value] of Object.entries(data)) {
            // Only include fields that are actually in the data object
            if (value !== undefined) {
                fields.push(`${key} = $${placeholderIndex}`);
                values.push(value);
                placeholderIndex++;
            }
        }

        if (fields.length === 0) return null;

        values.push(id);
        
        const query = `
            UPDATE schools 
            SET ${fields.join(', ')} 
            WHERE school_id = $${placeholderIndex} 
            RETURNING *`;

        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async delete(id) {
        const { rowCount } = await pool.query('DELETE FROM schools WHERE school_id = $1', [id]);
        return rowCount > 0;
    }

    async updateStatus(id, status) {
        const { rows } = await pool.query(
            `UPDATE schools
        SET status = $1
        WHERE school_id = $2
        RETURNING *`,
            [status, id]
        );

        return rows[0];
    }

}

export default new SchoolModel();