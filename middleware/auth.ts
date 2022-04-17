import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import JSONResponse from '../utils/response';

const prisma = new PrismaClient();

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        // hash the password
        req.body.password = await bcrypt.hash(req.body.password, 14);
        // save the user to db
        const user = await prisma.user.create({ data: req.body });
        // pass the user to the next middleware
        res.locals.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    const authFailure = JSONResponse.failure(undefined, 'The username and password do not match.', 401);
    try {
        const reqUser = req.body as { handle: string, password: string };
        // find user from the db using requests handle form/object
        const user = await prisma.user.findUnique({ where: { handle: reqUser.handle } })
        if (!user) throw authFailure;
        // compare the password of the user form db and from the request
        const authPassed = await bcrypt.compare(reqUser.password, user.password);
        if (!authPassed) throw authFailure;
        // pass the user to the next middleware
        res.locals.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

