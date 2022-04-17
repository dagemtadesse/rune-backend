import express from "express";
import { prisma, upload } from ".";
import { verifyJWT } from "../middleware/jwt";
import JSONResponse from "../utils/response";

export const chanRouter = express.Router();

chanRouter.get('/channels', verifyJWT(), async (req, res, next) => {
    // TODO: data validation
    const page = Number(req.query.page) || 0;
    const queryString = req.query.query as string;
    const size = Number(req.query.size) || 12;

    const channels = await prisma.channel.findMany({
        where: {
            name: {
                contains: queryString,
                mode: "insensitive", // case insensitive filtering &page=10
            }
        },
        take: size,  // LIMIT of the query
        skip: page * size // OFFSET
    });
    res.json(JSONResponse.success(channels));
})
// create a channel
chanRouter.post("/channel", verifyJWT('ADMIN'), async (req, res, next) => {
    // TODO: data validation
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
    res.status(201).json(JSONResponse.success(channel));
});

// update a channel
chanRouter.put('/channel/:name', verifyJWT('ADMIN'), async (req, res, next) => {
    // TODO: validation
    const updatedChannel = await prisma.channel.updateMany({
        where: {
            name: req.params.name,
            author: {
                id: res.locals.user.id
            }
        },
        data: {
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
        }
    });

    res.status(201).json(JSONResponse.success(updatedChannel));
});

// delete a channel
chanRouter.delete('/channel/:name', verifyJWT('ADMIN'), async (req, res) => {
    const { count } = await prisma.channel.deleteMany({
        where: {
            name: req.params.name,
            author: {
                id: res.locals.user.id
            }
        }
    });
    // removedChannels
    res.status(200).json(JSONResponse.success());
});

// read a channel
chanRouter.get('/channel/:name', verifyJWT(), async (req, res) => {
    const channel = await prisma.channel.findUnique({
        where: { name: req.params.name }
    });

    res.status(200).json(JSONResponse.success(channel));
});

// update/add image to channel
chanRouter.post('/channel/:name/logo', verifyJWT('ADMIN'), upload.single("logo"), async (req, res, next) => {
    // TODO: validation
    const user = await prisma.channel.updateMany({
        where: {
            name: req.params.name,
            author: {
                id: res.locals.user.id
            }
        },
        data: {
            logo: req.file?.path,
            mimeType: req.file?.mimetype
        }
    });
    res.sendStatus(200).json(JSONResponse.success(user));
});

// create sub-channel
chanRouter.post('/channel/:name/sub-channel', verifyJWT('ADMIN'), async (req, res, next) => {
    // TODO: channel validation
    const parentChannel = await prisma.channel.findMany({
        where: {
            name: req.params.name,
            author: {
                id: res.locals.user.id
            }
        }
    });
    // throw an error if the channel does not exist
    if (!parentChannel) throw new Error(`No channel named ${req.params.name}`);
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
                connect: { id: parentChannel[0].id }
            }
        }
    });
    res.status(201).json(JSONResponse.success(newChannel));
});