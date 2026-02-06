import express from 'express';
import * as surveyController from '../controllers/surveyController.js';

const router = express.Router();

// 1. Survey Creation and Listing
router.route('/')
    .get(surveyController.getSurveys)
    .post(surveyController.createSurvey);

// 2. Specific Survey Details
router.get('/:id', surveyController.getSurveyById);

// 3. Responses for a Specific Survey
router.route('/:id/responses')
    .get(surveyController.getResponsesBySurveyId)
    .post(surveyController.submitResponse);

export default router;
