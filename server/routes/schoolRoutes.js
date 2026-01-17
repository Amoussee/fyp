// server/routes/schoolRoutes.js
import { Router } from 'express';
import { getAllSchools, getSchoolByName } from '../controllers/schoolController.js';

const router = Router();

router.get('/', getAllSchools);
router.get('/:name', getSchoolByName);

export default router;
