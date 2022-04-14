import express from 'express';
import multer from 'multer';

export const upload = multer({
    dest: process.env.STORAGE_DIR,
});

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

// TODO implement default error handling
export default router;