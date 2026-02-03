// routes/response.routes.js
import express from 'express';
import ResponseController from '../controllers/responses.controller.js';
import ResponseValidator from '../middleware/responses.validator.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();

// --- General Survey Responses Routes ---
router
  .route('/')
  .post(authenticateUser, ResponseValidator.validateSubmission, ResponseController.create);

// ---  Specialized route for form-specific actions ---
router
  .route('/form/:formId')
  .get(authenticateUser, ResponseController.getByFormId)
  .delete(authenticateUser, ResponseController.deleteByForm);

// --- Specific Survey Responses Routes (:id) ---
router
  .route('/:id')
  .get(authenticateUser, ResponseController.getOne)
  .delete(authenticateUser, ResponseController.delete);

export default router;
