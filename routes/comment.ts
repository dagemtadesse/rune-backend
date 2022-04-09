import express from "express";
import { verifyJWT } from "../middleware/jwt";

export const commentRouter = express.Router();

// get comments
commentRouter.get('/post/:id/comments', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// get comments
commentRouter.get('/comment/:id', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// post comments
commentRouter.post('/post/:id/comment', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// delete comments
commentRouter.delete('/comment/:id', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// update comments
commentRouter.put('/comment/:id', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

