import express from "express";
import { prisma } from ".";
import { verifyJWT } from "../middleware/jwt";

export const commentRouter = express.Router();

// get comments
commentRouter.get('/:postId/comments', verifyJWT(), async (req, res) => {
    // TODO: Implementation
    const comments = await prisma.comment.findMany({
        where: {
            post: {
                id: Number(req.params.postId)
            }
        }
    });

    res.json(comments);
});

// get comments
commentRouter.get('/comment/:id', verifyJWT(), async (req, res) => {
    // TODO: validation
    const comment = await prisma.comment.findUnique({
        where: { id: Number(req.params.id) }
    });

    res.json(comment);
});

// post comments
commentRouter.post('/post/:id/comment', verifyJWT(), async (req, res) => {
    // TODO: validation
    const comment = await prisma.comment.create({
        data: {
            content: req.body.content,
            author: {
                connect: { id: res.locals.user.id }
            },
            post: {
                connect: { id: Number(req.params.id) }
            }
        }
    });

    res.status(201).json(comment);
});

// delete comments
commentRouter.delete('/comment/:id', verifyJWT(), async (req, res) => {
    // TODO: validation
    const comment = await prisma.comment.delete({
        where: { id: Number(req.params.id) }
    })

    res.json(comment);
});

// update comments
commentRouter.put('/comment/:id', verifyJWT(), async (req, res) => {
    // TODO: validation
    const updated = await prisma.comment.updateMany({
        where: {
            id: Number(req.params.id),
            author: {
                id: res.locals.user.id,
            }
        },
        data: {
            content: req.body.content
        }
    });

    res.json(updated)
});

