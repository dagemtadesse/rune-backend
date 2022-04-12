import { PrismaClient } from "@prisma/client";
import express from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";
import { v4 as uuid4 } from 'uuid';
import { verifyJWT } from "../middleware/jwt";

export const chanRouter = express.Router();
const prisma = new PrismaClient();

chanRouter.get('/channels', verifyJWT(), async (req, res, next) => {
    // TODO: data validation
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
                author: {
                    connect: { id: res.locals.user.id }
                }
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
chanRouter.post('/channel/:name/logo', verifyJWT('ADMIN'), async (req, res, next) => {
    // TODO: Implementation
    const file = req.files!.image as UploadedFile;
    const ext = path.extname(file.name)
    const outPath = path.join("assets", uuid4() + ext);

    fs.writeFile(outPath, file.data, (err) => {
        if (err) throw err;
    });

    const channelId = req.params.name;
    const channel = await prisma.channel.findUnique({
        where: { name: channelId }
    });
    if (channel?.authorId !== res.locals.user.id) {
        throw new Error(`Unauthorized access to channel ${channelId}`)
    }

    await prisma.channel.update({
        where: { name: channelId },
        data: { logo: outPath }
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
                    connect: { id: res.locals.user.id }
                }
            }
        });
        res.status(201).json({ channel: newChannel });
    } catch (error) {
        next(error); // pass the error to error handling middleware
    }
});