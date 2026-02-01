import express from 'express';
import SurveyController from '../controllers/survey.controller.js';
import SurveyValidator from '../middleware/survey.validator.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- General Survey Routes ---
router.route('/')
    .get(authenticateUser, SurveyController.getAllsurveys)
    .post(authenticateUser, SurveyValidator.validateCreate, SurveyController.createSurvey);

// ---- Filtered Routes ---
// router.route('/status/:status')
//     .get(authenticateUser, SurveyController.getByStatus);


// --- Specific Survey Routes (:id) ---
router.route('/:id')
    .get(authenticateUser, SurveyController.getById)
    .put(authenticateUser, SurveyValidator.validateUpdate ,SurveyController.update)
    .delete(authenticateUser, SurveyController.delete);

// Allows "Publish" (Draft->Open) and "Force Close" (Open->Closed)
router.patch('/:id/status', authenticateUser, SurveyController.updateStatus);

export default router;