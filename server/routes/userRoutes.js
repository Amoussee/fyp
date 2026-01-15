import express from 'express';
import {
    getUsers,
    getActiveUsers,
    getUserById, 
    addUser, 
    updateUser, 
    deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);   // GET /api/users
router.get('/active', getActiveUsers) // GET /api/users/active
// router.post('/', addUser);   // POST /api/users
router.post('/onboard', addUser); // POST /onboard/api/users
router.put('/:id', updateUser);           // Update
router.delete('/:id', deleteUser);        // Hard Delete
// router.patch('/:id/deactivate', deactivateUser); // Soft Delete

export default router;