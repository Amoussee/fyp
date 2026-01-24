import express from 'express';
import SurveyController from '../controllers/survey.controller.js';
import SurveyValidator from '../middleware/survey.validator.js';

const router = express.Router();

// --- General Survey Routes ---
router.route('/')
    .get(SurveyController.getAllsurverys)
    .post(SurveyValidator.validateCreate, SurveyController.createSurvey);

// ---- Filtered Routes ---




// --- Specific Survey Routes (:id) ---
router.route('/:id')
    .get(SurveyController.getById)
    .put(SurveyController.update)
    .delete(SurveyController.delete);


export default router;