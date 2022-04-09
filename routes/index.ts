import express from 'express';

import authRouter from './auth';
import { chanRouter } from './channel';

const router = express.Router();

router.use('/api/v1', authRouter);
router.use('/api/v1', chanRouter);

export default router;