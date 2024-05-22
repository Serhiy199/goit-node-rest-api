import express from 'express';

import {
    userRegister,
    userLogin,
    userLogout,
    userCurrent,
} from '../controllers/authControllers.js';

const router = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/logout', authMiddleware, userLogout);
router.get('/current', authMiddleware, userCurrent);

export default router;
