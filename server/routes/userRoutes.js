import express from 'express';
import { getUsers } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);   // GET /api/users
// router.post('/', addUser);   // POST /api/users

export default router;