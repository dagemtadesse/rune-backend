import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export function issueJWT(req: Request, res: Response, next: NextFunction) {
    //create a unique token id for invalidating the token when user logout
    const tokenId = uuidv4();
    const payload = {
        sub: res.locals.user.handle, // subject
        iat: Date.now(), // issued at
        tokenId 
    };

    // create the JWT token
    const token = jsonwebtoken.sign(payload, process.env.SECRET!, { expiresIn: "7d" });
    // pass the token to the next middleware
    res.locals.token = token;
    next();
}

export function verifyJWT(eq: Request, res: Response, next: NextFunction) {
    //TODO implementation
}