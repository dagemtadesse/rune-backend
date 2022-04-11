import { PrismaClient } from "@prisma/client";
import express from "express";
import { verifyJWT } from "../middleware/jwt";

export const chanRouter = express.Router();
const prisma = new PrismaClient();
// create a channel
chanRouter.post("/channel", verifyJWT('ADMIN'), async (req, res, next) => {
    // TODO: data validation
    try {
        const channel = await prisma.channel.create({
            data: {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                authorId: res.locals.user.id
            }
        });
        res.status(201).json({ channel });
    } catch (error) {
        next(error);
    }
});

// update a channel
chanRouter.put('/channel/:name', verifyJWT('ADMIN'), (req, res) => {
    // TODO: Implementation
});

// delete a channel
chanRouter.delete('/channel/:name', verifyJWT('ADMIN'), async (req, res) => {
    let removedChannels = null;
    try {
        const channelId = req.params.name;
        removedChannels = await prisma.channel.deleteMany({
            where: {
                name: channelId,
                authorId: res.locals.user.id
            }
        });
    } finally {
        res.status(200).json({ removedChannels });
    }
});

// read a channel
chanRouter.get('/channel/:name', verifyJWT(), async (req, res) => {
    let channel = null;
    try {
        channel = await prisma.channel.findUnique({
            where: { name: req.params.name }
        });
    }finally {
        res.status(200).json({ channel });
    }
});

// update/add image to channel
chanRouter.post('/channel/logo', verifyJWT('ADMIN'), (req, res) => {
    // TODO: Implementation
});

// create sub-channel
chanRouter.post('/channel/:name/sub-channel', verifyJWT('ADMIN'), async (req, res, next) => {
    // TODO: channel validation
    try {
        const parentChannel = await prisma.channel.findUnique({
            where: { name: req.params.name }
        });
        // throw an error if the channel does not exist
        if (!parentChannel) throw new Error(`No channel named ${req.params.name}`);
        // throw an error if the author of the channel is not the user
        if (parentChannel.authorId !== res.locals.user.id) {
            throw new Error(`Unauthorized access to channel ${req.params.name}`)
        }
        // create new channel
        const newChannel = await prisma.channel.create({
            data: {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                authorId: res.locals.user.id,
                parentChannelId: parentChannel!.id
            }
        });
        res.status(201).json({channel: newChannel});
    } catch (error) {
        next(error); // pass the error to error handling middleware
    }
});