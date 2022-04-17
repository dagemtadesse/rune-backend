import { PrismaClient } from '@prisma/client';
import express from 'express';
import multer from 'multer';
import { routeErrorHandler } from '../middleware/errors';

export const upload = multer({
    dest: process.env.STORAGE_DIR,
});

export const prisma = new PrismaClient();

import authRouter from './auth';
import { chanRouter } from './channel';
import { commentRouter } from './comment';
import { postRouter } from './post';
import { userRouter } from './user';

const router = express.Router();
// upload middleware
router.use(
    '/api/v1',
    // register route handlers
    authRouter,
    chanRouter,
    userRouter,
    commentRouter,
    postRouter,
);

router.use(routeErrorHandler);
// TODO implement default error handling
export default router;