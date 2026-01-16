import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Routes for /api/users
router.route('/')
  .get(userController.getUsers)
  .post(userController.addUser);

// Special/Specific Filters
router.get('/active', userController.getActiveUsers);
router.get('/info', userController.getUsersInfo);

// Routes for /api/users/:id
router.route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

// Specific Action
router.patch('/deactivate', userController.deactivateUser);

export default router;