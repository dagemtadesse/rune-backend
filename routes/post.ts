import express, { Request, Response, NextFunction} from "express";
import { prisma, upload } from ".";
import { verifyJWT } from "../middleware/jwt";
import JSONResponse from "../utils/response";

export const postRouter = express.Router();

async function isPostAuthor(req: Request, res: Response, next: NextFunction) {
    try{
        const postId = Number(req.params.id);
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });
        if (post?.authorId != res.locals.user.id) {
            throw JSONResponse.failure(undefined, "unauthorized access", 401);
        }
        next();
    }catch(error){
        next(error);
    }
}
// get posts
postRouter.get('/:channelId/posts', verifyJWT(), async (req, res, next) => {
    const page = Number(req.query.page) || 0;
    const size = Number(req.query.size) || 12;
    try {
        // select * from post, channel where channel.name = req.params.channel
        const posts = await prisma.post.findMany({
            where: {
                channel: {
                    id: Number(req.params.channelId)
                }
            },
            take: size,  // LIMIT of the query
            skip: page * size // OFFSET
        })
        res.json(JSONResponse.success(posts));
    } catch (error) { next(error); }
});

// get post
postRouter.get('/posts/:id', verifyJWT(), async (req, res, next) => {
    // TODO: validation
    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(req.params.id) }
        });
        res.json(JSONResponse.success(post)); // sends null if a channel is not found
    } catch (error) { next(error); }
});

// delete post
postRouter.delete('/posts/:id', verifyJWT(), isPostAuthor, async (req, res, next) => {
    try {
        const post = await prisma.post.delete({
            where: {
                id: Number(req.params.id),
            }
        });
        res.json(JSONResponse.success(post));
    } catch (error) { next(error); }
});

// create post
postRouter.post('/:channel/post', verifyJWT(), upload.single("media"), async (req, res, next) => {
    // TODO: validation,
    try {
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
        res.json(JSONResponse.success(post));
    } catch (error) { next(error); }

});

// update a post
postRouter.put('/posts/:id', verifyJWT(), isPostAuthor, upload.single("media"), async (req, res, next) => {
    // TODO: validation
    try {
        const updated = await prisma.post.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                text: req.body.text,
                mediaUrl: req.file?.path,
                mimeType: req.file?.mimetype,
            }
        });
        res.json(JSONResponse.success(updated))
    } catch (error) { next(error); }

});

// react to a post
postRouter.post('/:reactionType/posts/:id', verifyJWT(), async (req, res, next) => {
    const reaction = req.params.reactionType;
    const postId = Number(req.params.id);
    try {
        const updated = await prisma.postReaction.upsert({
            where: {
                userId_postId: {
                    userId: res.locals.user.id,
                    postId: postId,
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
                post: {
                    connect: { id: postId }
                }
            }
        });
        res.json(JSONResponse.success(updated));
    } catch (error) { next(error); }
});