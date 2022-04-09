import express from "express";
import { verifyJWT } from "../middleware/jwt";

export const chanRouter = express.Router();

// get posts
chanRouter.get('/posts', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// get post
chanRouter.get('/post/:id', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// delete post
chanRouter.delete('/post/:id', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// create post
chanRouter.post('/post', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// update a port
chanRouter.put('/post/:id', verifyJWT(), (req, res) => {
    // TODO: Implementation
});
