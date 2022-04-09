import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

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
        let errorMsg = "Unable to register a user";

        if (error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") { // unique constraint error

            errorMsg = "Database error make sure to use unique handle and email";
        }

        next(new Error(errorMsg));
    }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const reqUser = req.body as { handle: string, password: string };

        // find user from the db using requests handle form/object
        const user = await prisma.user.findUnique({ where: { handle: reqUser.handle } })

        if (!user) throw Error(`Unable to find a user with username '${reqUser.handle}'.`)
        // compare the password of the user form db and from the request
        const authPassed = await bcrypt.compare(reqUser.password, user.password);

        if (!authPassed) throw Error('The username and password do not match.');
        // pass the user to the next middleware
        res.locals.user = user;
        next();

    }catch(error){
        next(error);
    }
}

