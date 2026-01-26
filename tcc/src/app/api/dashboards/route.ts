
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/lib/db';
import { decodeSession, SESSION_COOKIE_NAME } from '@/lib/mockAuth';
import { Dashboard } from '@/types/dashboard';

export async function GET() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = sessionToken ? decodeSession(sessionToken) : null;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM dashboards WHERE user_id = ? ORDER BY created_at DESC',
            [session.sub]
        );

        const dashboards = await Promise.all(rows.map(async (dash: any) => {
            const [widgetRows]: any = await pool.query(
                'SELECT * FROM dashboard_widgets WHERE dashboard_id = ? ORDER BY slot_index ASC',
                [dash.id]
            );

            const widgets = widgetRows.map((w: any) => ({
                id: w.id,
                questionId: w.question_id,
                chartType: w.chart_type,
                aggregation: w.aggregation,
                title: w.title,
                pivotState: w.pivot_state, // specific JSON handling might be needed depending on driver options
            }));

            return {
                id: dash.id,
                name: dash.name,
                layoutType: dash.layout_type,
                widgets: widgets
            };
        }));

        return NextResponse.json(dashboards);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const session = sessionToken ? decodeSession(sessionToken) : null;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const dashboard: Dashboard = await request.json();

        // Validation
        if (!dashboard.id || !dashboard.name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Upsert Dashboard
            // ON DUPLICATE KEY UPDATE helps if we reuse IDs. 
            // If we want to replace, we can do INSERT ... ON DUPLICATE KEY UPDATE name=VALUES(name)...
            await connection.query(
                `INSERT INTO dashboards (id, user_id, name, layout_type)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), layout_type = VALUES(layout_type), updated_at = NOW()`,
                [dashboard.id, session.sub, dashboard.name, dashboard.layoutType]
            );

            // 2. Delete existing widgets for this dashboard (full replace strategy)
            await connection.query('DELETE FROM dashboard_widgets WHERE dashboard_id = ?', [dashboard.id]);

            // 3. Insert new widgets
            if (dashboard.widgets.length > 0) {
                const values = dashboard.widgets.map((w, index) => [
                    w.id,
                    dashboard.id,
                    index,
                    w.questionId,
                    w.chartType,
                    w.aggregation,
                    w.title || null,
                    JSON.stringify(w.pivotState || {})
                ]);

                await connection.query(
                    `INSERT INTO dashboard_widgets 
           (id, dashboard_id, slot_index, question_id, chart_type, aggregation, title, pivot_state)
           VALUES ?`,
                    [values]
                );
            }

            await connection.commit();
            return NextResponse.json({ success: true });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
