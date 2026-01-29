// routes/response.routes.js
import express from 'express';
import ResponseController from '../controllers/responses.controller.js';
import ResponseValidator from '../middleware/responses.validator.js';

const router = express.Router();

// --- General Survey Responses Routes ---
router.route('/')
    .post(ResponseValidator.validateSubmission, ResponseController.create);

// ---  Specialized route for form-specific actions --- 
router.route('/form/:formId')
    .get(ResponseController.getByFormId)
    .delete(ResponseController.deleteByForm);

// --- Specific Survey Responses Routes (:id) ---
router.route('/:id')
    .get(ResponseController.getOne)
    .delete(ResponseController.delete);

export default router;