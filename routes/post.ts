import express from "express";
import { prisma, upload } from ".";
import { verifyJWT } from "../middleware/jwt";

export const postRouter = express.Router();

// get posts
postRouter.get('/:channel/posts', verifyJWT(), async (req, res) => {
    const page = Number(req.query.page) || 0;
    const size = Number(req.query.size) || 12;
    // select * from post, channel where channel.name = req.params.channel
    const posts = await prisma.post.findMany({
        where: {
            channel: {
                name: req.params.channel
            }
        },
        take: size,  // LIMIT of the query
        skip: page * size // OFFSET
    })
    res.json(posts);
});

// get post
postRouter.get('/posts/:id', verifyJWT(), async (req, res) => {
    // TODO: validation
    const post = await prisma.post.findUnique({
        where: { id: Number(req.params.id) }
    });
    res.json(post); // sends null if a channel is not found
});

// delete post
postRouter.delete('/posts/:id', verifyJWT(), async (req, res) => {
    const post = await prisma.post.deleteMany({
        where: {
            id: Number(req.params.id),
            author: {
                id: res.locals.user.id
            },
        }
    });
    res.json(post);
});

// create post
postRouter.post('/:channel/post', verifyJWT(), upload.single("media"), async (req, res) => {
    // TODO: validation,
    const post = await prisma.post.create({
        data: {
            text: req.body.text,
            mediaUrl: req.file?.path,
            mimeType: req.file?.mimetype,
            author: {
                connect: { id: res.locals.user.id }
            },
            channel: {
                connect: { name: req.params.channel }
            }
        }
    });
    res.json(post);
});

// update a post
postRouter.put('/posts/:id', verifyJWT(), upload.single("media"), async (req, res) => {
    // TODO: validation
    const updated = await prisma.post.updateMany({
        where: {
            id: Number(req.params.id),
            author: {
                id: res.locals.user.id,
            }
        },
        data: {
            text: req.body.text,
            mediaUrl: req.file?.path,
            mimeType: req.file?.mimetype,
        }
    });
    res.json(updated)
});
