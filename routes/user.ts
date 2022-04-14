import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from 'bcryptjs';
import { verifyJWT } from "../middleware/jwt";

export const userRouter = express.Router();
const prisma = new PrismaClient();
// get user
userRouter.get('/user/:handle', verifyJWT(), async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { handle: req.params.handle }
    });

    res.json(user);
});

// update user
userRouter.put('/user', verifyJWT(), async (req, res) => {
    // TODO: Implementation
    let updated = await prisma.user.update({
        where: { id: res.locals.user.id },
        data: {
            handle: req.body.handle,
            fullname: req.body.fullname,
            email: req.body.email,
            avatar: req.file?.path,
            password: await bcrypt.hash(req.body.password, 14),
            mimeType: req.file?.mimetype
        }
    });
    let jsonUpdate = updated as any
    // remove the password from the json object
    delete jsonUpdate.password;
    res.json(updated);
});

// get user
userRouter.delete('/user', verifyJWT(), async (req, res) => {
    const updated = await prisma.user.delete({
        where: { id: Number(res.locals.user.id) }
    });

    res.json(updated);
});