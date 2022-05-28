import { channel } from "diagnostics_channel";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { prisma, upload } from ".";
import { verifyJWT } from "../middleware/jwt";
import JSONResponse from "../utils/response";
import { Prisma } from '@prisma/client';
import { markPinnedChannel } from "../utils/reaction";
export const chanRouter = express.Router();

async function isChannelOwner(req: Request, res: Response, next: NextFunction) {
    try {
        const channelId = Number(req.params.channelId);
        const channel = await prisma.channel.findUnique({
            where: { id: channelId }
        });
        if (channel?.authorId != res.locals.user.id) {
            throw JSONResponse.failure(undefined, "unauthorized access", 401);
        }
        next();
    } catch (error) {
        next(error);
    }
}

chanRouter.get('/channels', verifyJWT(), async (req, res, next) => {
    // console.log('called')
    // TODO: data validation
    const page = Number(req.query.page) || 0;
    const queryString = req.query.query as string;
    const size = Number(req.query.size) || 12;
    const bookmarks = req.query.bookmark ?? false

    console.log(Boolean(bookmarks) == true);
    try {
        const channels = await prisma.channel.findMany({
            where: {
                name: {
                    contains: queryString,
                    mode: "insensitive", // case insensitive filtering &page=10
                },
                pinnedBy:  bookmarks ? {
                    some: {
                        userId: res.locals.user.id
                    }
                } : undefined
            },
            include: {
                pinnedBy: true
            },
            take: size,  // LIMIT of the query
            skip: page * size, // OFFSET
            orderBy: {
                createAt: req.query.order == 'asc' ? 'asc' : 'desc'
            }
        });
        const markedChannels = channels.map(channel =>
            markPinnedChannel(res.locals.user.id, channel));

        res.json(JSONResponse.success(markedChannels));
    } catch (error) { next(error); }
});

// create a channel
chanRouter.post("/channel", verifyJWT('ADMIN'), async (req, res, next) => {
    // TODO: data validation
    try {
        const channel = await prisma.channel.create({
            data: {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                description: req.body.description,
                author: {
                    connect: { id: res.locals.user.id }
                }
            }
        });
        res.status(201).json(JSONResponse.success(channel));
    } catch (error) { next(error) }
});

// update a channel
chanRouter.put('/channel/:channelId', verifyJWT('ADMIN'), isChannelOwner, async (req, res, next) => {
    // TODO: validation
    try {
        const updated = await prisma.channel.update({
            where: {
                id: Number(req.params.channelId),
            },
            data: {
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                description: req.body.description
            }
        });
        if (!updated) {
            throw JSONResponse.failure(undefined, "unable to update channel", 404);
        }
        res.status(201).json(JSONResponse.success());
    } catch (error) { next(error) }
});

// bookmark channel
chanRouter.put('/pin/:channelId', verifyJWT(), async (req, res, next) => {
    // TODO: validation
    try {
        const pinned = await prisma.channelBookmark.create({
            data: {
                userId: res.locals.user.id,
                channelId: Number(req.params.channelId)
            }
        });
        if (!pinned) {
            throw JSONResponse.failure(undefined, "unable to bookmark channel", 404);
        }
        res.status(201).json(JSONResponse.success());
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            res.status(200).json(JSONResponse.success());
            return;
        }

        next(err)
    }
});

chanRouter.put('/unpin/:channelId', verifyJWT(), async (req, res, next) => {
    // TODO: validation
    try {
        await prisma.channelBookmark.delete({
            where: {
                userId_channelId: {
                    userId: Number(res.locals.user.id),
                    channelId: Number(req.params.channelId)
                }
            }
        });

        
    } finally{
        res.status(200).json(JSONResponse.success());
     }
});

// delete a channel
chanRouter.delete('/channel/:channelId', verifyJWT('ADMIN'), isChannelOwner, async (req, res, next) => {
    try {
        const deleted = await prisma.channel.delete({
            where: {
                id: Number(req.params.channelId),
            }
        });
        // removedChannels
        res.status(200).json(JSONResponse.success(deleted));
    } catch (error) {
        next(error);
    }
});

// read a channel
chanRouter.get('/channels/:channelId', verifyJWT(), async (req, res, next) => {
    try {
        const channel = await prisma.channel.findUnique({
            where: { id: Number(req.params.channelId) },
            include: {
                pinnedBy: true
            }
        });

        res.status(200).json(JSONResponse.success(markPinnedChannel(res.locals.user.id, channel)));
    } catch (error) { next(error) }
});

// update/add image to channel
chanRouter.post('/channels/:channelId/logo', verifyJWT('ADMIN'), isChannelOwner, upload.single("logo"), async (req, res, next) => {
    // TODO: validation
    try {
        if (!req.file)
            throw Error("Failure");

        const user = await prisma.channel.update({
            where: {
                id: Number(req.params.channelId),
            },
            data: {
                logo: path.basename(req.file!.path),
                mimeType: req.file?.mimetype
            }
        });
        res.status(200).json(JSONResponse.success(user));
    } catch (error) {
        next(error);
    }
});

// create sub-channel
chanRouter.post('/channels/:channelId/sub-channel', verifyJWT('ADMIN'), isChannelOwner, async (req, res, next) => {
    // TODO: channel validation
    try {
        const parentChannel = await prisma.channel.findMany({
            where: {
                id: Number(req.params.channelId),
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
                description: req.body.description,
                author: {
                    connect: { id: res.locals.user.id }
                },
                parentChannel: {
                    connect: { id: parentChannel[0].id }
                }
            }
        });
        res.status(201).json(JSONResponse.success(newChannel));
    } catch (error) { next(error); }
});
