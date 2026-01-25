import express from 'express';
import SchoolController from '../controllers/school.controller.js';
import SchoolValidator from '../middleware/school.validator.js';

const router = express.Router();

// --- General School Routes ---
router.route('/')
  .get(SchoolController.getAll)
  .post(SchoolValidator.validateCreate, SchoolController.create);

// --- Query / Filter ---
router.post('/search', SchoolValidator.validateSearch ,SchoolController.search);

// --- Status Update ---
router.patch(
  '/:id/status',
  SchoolValidator.validateId,
  SchoolValidator.validateStatus,
  SchoolController.updateStatus
);

// --- Specific School Routes ---
router.route('/:id')
  .get(SchoolValidator.validateId, SchoolController.getById)
  .put(
    SchoolValidator.validateId,
    SchoolValidator.validateUpdate,
    SchoolController.update
  )
  .delete(
    SchoolValidator.validateId,
    SchoolController.delete
  );

export default router;
