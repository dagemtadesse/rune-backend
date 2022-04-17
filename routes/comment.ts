import express, { Request, Response, NextFunction} from "express";
import { prisma } from ".";
import { verifyJWT } from "../middleware/jwt";
import JSONResponse from "../utils/response";

export const commentRouter = express.Router();

async function isCommentAuthor(req: Request, res: Response, next: NextFunction) {
    try{
        const commentId = Number(req.params.id);
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });
        if (comment?.authorId != res.locals.user.id) {
            throw JSONResponse.failure(undefined, "unauthorized access", 401);
        }
        next();
    }catch(error){
        next(error);
    }
}

// get comments
commentRouter.get('/:postId/comments', verifyJWT(), async (req, res, next) => {
    // TODO: validation
    try {
        const comments = await prisma.comment.findMany({
            where: {
                post: {
                    id: Number(req.params.postId)
                }
            }
        });
        res.json(JSONResponse.success(comments));
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
        const reaction = req.params.reactionType;
        const commentId = Number(req.params.id);
        const updated = await prisma.commentReaction.upsert({
            where: {
                userId_commentId: {
                    userId: res.locals.user.id,
                    commentId: commentId,
                }
            },
            update: {
                upvote: reaction === 'upvote',
                downvote: reaction === 'downvote'
            },
            create: {
                upvote: reaction === 'upvote',
                downvote: reaction === 'downvote',
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

