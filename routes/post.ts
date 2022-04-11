import express from "express";
import { verifyJWT } from "../middleware/jwt";

export const postRouter = express.Router();

// get posts
postRouter.get('/posts', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// get post
postRouter.get('/post/:id', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// delete post
postRouter.delete('/post/:id', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// create post
postRouter.post('/post', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// update a port
postRouter.put('/post/:id', verifyJWT(), (req, res) => {
    // TODO: Implementation
});
