import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

const prisma = new PrismaClient();

export function issueJWT(req: Request, res: Response, next: NextFunction) {

    const payload = {
        sub: res.locals.user.id, // subject
        iat: Date.now(), // issued at
    };
    // create the JWT token
    const token = jsonwebtoken.sign(payload, process.env.SECRET!, { expiresIn: "7d" });
    // pass the token to the next middleware
    res.locals.token = token;
    next();
}

export function verifyJWT(role?: string) {

    return async function(req: Request, res: Response, next: NextFunction) {
        try {
            // decode the JWT and verify if its valid
            const payload = jsonwebtoken.verify(req.body.token, process.env.SECRET!);
            // find the user using the id from jwt token 
            const user = await prisma.user.findUnique({where: { id: Number(payload.sub)}});
            //  pass it to the next middleware
            res.locals.user = user;
            // goto the next middleware if the role is not required or it the same as the users role
            if(!role || role == user?.role){
                next();
            }

            throw new Error('Unauthorized user');
            
        } catch (error) {
            next(error);
        }
    }
}