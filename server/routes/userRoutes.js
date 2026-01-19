import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// 1. Root Routes
router.route('/')
    .get(userController.getUsers)
    .post(userController.addUser);

// 2. Specific Filters (MUST come before /:id)
router.get('/active', userController.getActiveUsers);
router.get('/info', userController.getUsersInfo);

// 3. Dynamic ID Routes
router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

// 4. Specific Actions
router.patch('/:id/deactivate', userController.deactivateUser);

export default router;
