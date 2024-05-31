import express from 'express';
import uploadMiddleware from '../middleware/upload.js';

import {
    userRegister,
    userLogin,
    userLogout,
    userCurrent,
    uploadAvatars,
    userVerify,
} from '../controllers/authControllers.js';

const router = express.Router();

import authMiddleware from '../middleware/authMiddleware.js';
router.get('/verify/:verificationToken', userVerify);
router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/logout', authMiddleware, userLogout);
router.get('/current', authMiddleware, userCurrent);
router.patch('/avatars', authMiddleware, uploadMiddleware.single('avatar'), uploadAvatars);

export default router;
