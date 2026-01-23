import express from 'express';
import * as schoolController from '../controllers/schoolController.js';

const router = express.Router();

// --- General School Routes ---
// GET /api/schools - Get all schools information
// POST /api/schools - Onboard a new school
router.route('/')
    .get(schoolController.getAllSchools)
    .post(schoolController.addSchool);

// --- Filtered Routes ---
router.get('/filterBySchoolName', schoolController.getSchoolByName);
router.put('/updateSchoolStatus/:id', schoolController.updateSchoolStatus);

// --- Specific User Routes (:id) ---
router.route('/:id')
  .get(schoolController.getSchoolById)
  .put(schoolController.updateSchool)
  .delete(schoolController.deleteSchool);

export default router;
