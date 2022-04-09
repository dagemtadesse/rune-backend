import express from "express";
import { verifyJWT } from "../middleware/jwt";

export const chanRouter = express.Router();

// create a channel
chanRouter.post("/channel", verifyJWT('ADMIN'), (req, res) => {
    // TODO: Implementation
});

// update a channel
chanRouter.put('/channel/:name', verifyJWT('ADMIN'), (req, res) => {
    // TODO: Implementation
});

// delete a channel
chanRouter.delete('/channel/:name', verifyJWT('ADMIN'), (req, res) => {
// TODO: Implementation
});

// read a channel
chanRouter.get('/channel/:name', verifyJWT(), (req, res) => {
// TODO: Implementation
});

// update/add image to channel
chanRouter.post('/channel/logo', verifyJWT('ADMIN'), (req, res) => {
// TODO: Implementation
});

// create sub-channel
chanRouter.post('/channel/:name/sub-channel', verifyJWT('ADMIN'), (req, res) => {
// TODO: Implementation
});