import express from 'express';

import { AuthControllers } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', AuthControllers);

// router.get('/login', getOneContact);

export default router;
