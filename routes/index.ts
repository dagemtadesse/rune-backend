import express from 'express';

import authRouter from './auth';
import { chanRouter } from './channel';
import { commentRouter } from './comment';
import { postRouter } from './post';
import { userRouter } from './user';

const router = express.Router();

router.use(
    '/api/v1',
    // register route handlers
    authRouter,
    chanRouter,
    userRouter,
    commentRouter,
    postRouter,
);

// TODO error handling

export default router;