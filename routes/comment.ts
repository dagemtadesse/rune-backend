import { Vote } from "@prisma/client";
import express, { Request, Response, NextFunction } from "express";
import { prisma } from ".";
import { verifyJWT } from "../middleware/jwt";
import { countReaction } from "../utils/reaction";
import JSONResponse from "../utils/response";

export const commentRouter = express.Router();

async function isCommentAuthor(req: Request, res: Response, next: NextFunction) {
    try {
        const commentId = Number(req.params.id);
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });
        if (comment?.authorId != res.locals.user.id) {
            throw JSONResponse.failure(undefined, "unauthorized access", 401);
        }
        next();
    } catch (error) {
        next(error);
    }
}

// get comments
commentRouter.get('/:postId/comments', verifyJWT(), async (req, res, next) => {
    // TODO: validation
    const page = Number(req.query.page) || 0;
    const size = Number(req.query.size) || 12;
    try {
        const comments = await prisma.comment.findMany({
            where: {
                post: {
                    id: Number(req.params.postId)
                }
            },
            include: {
                reactions: true
            },
            take: size,  // LIMIT of the query
            skip: page * size // OFFSET
        });

        const countedComment = comments.map(comment => {
            return countReaction(res.locals.user.id, comment);
        });

        res.json(JSONResponse.success(countedComment));
    } catch (error) { next(error); }
});

// get a comment
commentRouter.get('/comment/:id', verifyJWT(), async (req, res, next) => {
    // TODO: validation
    try {
        const comment = await prisma.comment.findUnique({
            where: { id: Number(req.params.id) }
        });
        res.json(JSONResponse.success(comment));
    } catch (error) { next(error); }
});

// post comments
commentRouter.post('/post/:id/comment', verifyJWT(), async (req, res, next) => {
    // TODO: validation
    try {
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
        res.status(201).json(JSONResponse.success(comment));
    } catch (error) { next(error); }
});

// delete comments
commentRouter.delete('/comment/:id', verifyJWT(), isCommentAuthor, async (req, res, next) => {
    // TODO: validation
    try {
        const comment = await prisma.comment.delete({
            where: { id: Number(req.params.id) }
        })
        res.json(JSONResponse.success(comment));

    } catch (error) { next(error); }
});

// update comments
commentRouter.put('/comment/:id', verifyJWT(), isCommentAuthor, async (req, res, next) => {
    // TODO: validation
    try {
        const updated = await prisma.comment.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                content: req.body.content
            }
        });
        res.json(JSONResponse.success(updated))
    } catch (error) { next(error); }
});

commentRouter.post('/:reactionType/comment/:id', verifyJWT(), async (req, res, next) => {
    try {
        let reaction = req.params.reactionType.toLowerCase();
        let vote: Vote = Vote.NONE;
        if(reaction == 'upvote') vote = Vote.UP_VOTE;
        else if(reaction == 'downvote') vote = Vote.DOWN_VOTE;

        const commentId = Number(req.params.id);

        const updated = await prisma.commentReaction.upsert({
            where: {
                userId_commentId: {
                    userId: res.locals.user.id,
                    commentId: commentId,
                }
            },
            update: {
                vote: vote,
            },
            create: {
                vote: vote,
                user: {
                    connect: { id: res.locals.user.id }
                },
                comment: {
                    connect: { id: commentId }
                }
            }
        });
        res.json(JSONResponse.success(updated));
    } catch (error) { next(error); }
});

