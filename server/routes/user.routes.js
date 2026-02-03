import express from 'express';
import UserController from '../controllers/user.controller.js';
import UserValidator from '../middleware/user.validator.js';

const router = express.Router();

// --- Root Routes ---
// GET /api/users        -> get all users
// POST /api/users       -> create new user
router
  .route('/')
  .get(UserController.getAll)
  .post(UserValidator.validateCreate, UserController.create);

// --- Filter / Query Routes ---
// GET /api/users/active -> get active users
// GET /api/users/info   -> get public user info
router.get('/active', UserController.getActive);

// --- Specific User Routes (:id MUST come after fixed routes) ---
router
  .route('/:id')
  .get(UserValidator.validateId, UserController.getById)
  .put(UserValidator.validateId, UserValidator.validateUpdate, UserController.update)
  .delete(UserValidator.validateId, UserController.delete);

// --- Specific Actions ---
router.patch('/:id/deactivate', UserValidator.validateId, UserController.deactivate);

export default router;
