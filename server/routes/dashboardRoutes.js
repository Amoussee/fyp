import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// 1. Root Routes (Get all or Create/Update)
router.route('/')
    .get(dashboardController.getDashboards)
    .post(dashboardController.upsertDashboard);

// 2. Specific ID Routes
router.route('/:id')
    .get(dashboardController.getDashboardById)
    .delete(dashboardController.deleteDashboard);

export default router;
