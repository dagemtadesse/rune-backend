import { PrismaClient } from "@prisma/client";
import express from "express";
import { upload } from ".";
import { verifyJWT } from "../middleware/jwt";

export const chanRouter = express.Router();
const prisma = new PrismaClient();

chanRouter.get('/channels', verifyJWT(), async (req, res, next) => {
    // TODO: data validation
    const page = Number(req.query.page) || 0;
    const queryString = req.query.query as string;
    const size = Number(req.query.size) || 12;

    const channels = await prisma.channel.findMany({
        where: {
            name: {
                contains: queryString,
                mode: "insensitive", // case insensitive filtering
            }
        },
        take: size,  // LIMIT of the query
        skip: page * size // OFFSET
    });
    res.json(channels);
})
// create a channel
chanRouter.post("/channel", verifyJWT('ADMIN'), async (req, res, next) => {
    // TODO: data validation
    try {
        const channel = await prisma.channel.create({
            data: {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                author: {
                    connect: { id: res.locals.user.id }
                }
            }
        });
        res.status(201).json({ channel });
    } catch (error) {
        next(error);
    }
});

// update a channel
chanRouter.put('/channel/:name', verifyJWT('ADMIN'), async (req, res, next) => {
    // TODO: validation
    try {
        const channel = await prisma.channel.findUnique({
            where: { name: req.params.name }
        });
        if (channel?.authorId !== res.locals.user.id) {
            throw new Error(`Unauthorized access to channel ${req.params.name}`)
        }
        const updatedChannel = await prisma.channel.update({
            where: { name: req.params.name, },
            data: {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
            }
        });
        res.status(201).json({ channel: updatedChannel });
    } catch (error) {
        next(error);
    }
});

// delete a channel
chanRouter.delete('/channel/:name', verifyJWT('ADMIN'), async (req, res) => {
    let removedChannels = null;
    try {
        const channelId = req.params.name;
        const channel = await prisma.channel.findUnique({
            where: { name: channelId }
        });
        if (channel?.authorId !== res.locals.user.id) {
            throw new Error(`Unauthorized access to channel ${channelId}`)
        }
        removedChannels = await prisma.channel.delete({
            where: { name: channelId }
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
    } finally {
        res.status(200).json({ channel });
    }
});

// update/add image to channel
chanRouter.post('/channel/:name/logo', verifyJWT('ADMIN'), upload.single("logo"), async (req, res, next) => {
    // TODO: Implementation
    const channelId = req.params.name;

    await prisma.channel.updateMany({
        where: {
            name: channelId,
            author: {
                id: res.locals.user.id
            }
        },
        data: {
            logo: req.file?.path,
            mimeType: req.file?.mimetype
        }
    });
    res.sendStatus(200);
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
                author: {
                    connect: { id: res.locals.user.id }
                },
                parentChannel: {
                    connect: { id: parentChannel.id }
                }
            }
        });
        res.status(201).json({ channel: newChannel });
    } catch (error) {
        next(error); // pass the error to error handling middleware
    }
});