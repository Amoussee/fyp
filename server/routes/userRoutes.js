import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// --- General User Routes ---
// GET /api/users - Get all users
// POST /api/users - Onboard a new user
router.route('/')
    .get(userController.getUsers)
    .post(userController.addUser);

// --- Filtered Routes ---
// GET /api/users/active - Get users where deactivated = false
router.get('/active', userController.getActiveUsers);

// GET /api/users/info - Get users without sensitive info (passwords)
router.get('/info', userController.getUsersInfo);

// --- Specific User Routes (:id) ---
// GET /api/users/:id - Get specific user
// PUT /api/users/:id - Update user details
// DELETE /api/users/:id - Hard delete user
router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

// --- Specific Actions ---
// PATCH /api/users/:id/deactivate - Soft delete/Deactivate a user
// Note: Changed to include :id in the path to match the controller logic
router.patch('/:id/deactivate', userController.deactivateUser);

export default router;
