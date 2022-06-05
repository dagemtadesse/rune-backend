import express from "express";
import bcrypt from 'bcryptjs';
import { verifyJWT } from "../middleware/jwt";
import { prisma, upload } from ".";
import JSONResponse from "../utils/response";
import path from "path";
import { Role } from "@prisma/client";

export const userRouter = express.Router();
// get user
userRouter.get('/user/:handle', verifyJWT(), async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { handle: req.params.handle }
        });
        res.json(JSONResponse.success(user));
    } catch (error) { next(error); }
});

// get user
userRouter.get('/user/id/:userId', verifyJWT(), async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.params.userId) }
        });
        res.json(JSONResponse.success(user));
    } catch (error) { next(error); }
});


// update user
userRouter.put('/user', verifyJWT(), upload.single("avatar"), async (req, res, next) => {
    // TODO: validation
    try {
        let updated = await prisma.user.update({
            where: { id: Number(res.locals.user.id) },
            data: {
                handle: req.body.handle,
                fullname: req.body.fullname,
                email: req.body.email,
                role: req.body.grantAdminStatus ? Role.ADMIN :  Role.USER,
                avatar: req.file ? path.basename(req.file?.path) : undefined,
                password: req.body.password ? await bcrypt.hash(req.body.password, 14): undefined,
                mimeType: req.file?.mimetype
            }
        });
        let jsonUpdate = updated as any
        // remove the password from the json object
        delete jsonUpdate.password;
        res.json(JSONResponse.success(updated));
    } catch (error) { next(error); }
});

// delete user
userRouter.delete('/user', verifyJWT(), async (req, res, next) => {
    try {
        const deleted = await prisma.user.delete({
            where: { id: Number(res.locals.user.id) }
        });
        res.json(JSONResponse.success(deleted));
    } catch (error) { next(error); }
});
