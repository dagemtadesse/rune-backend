import express from "express";
import { verifyJWT } from "../middleware/jwt";

export const userRouter = express.Router();

// get comments
userRouter.get('/user/:handle', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// update comments
userRouter.put('/user/:handle', verifyJWT(), (req, res) => {
    // TODO: Implementation
});

// get comments
userRouter.delete('/user/:handle', verifyJWT(), (req, res) => {
    // TODO: Implementation
});