import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from 'express';
import JSONResponse from "../utils/response";
import { Prisma } from "@prisma/client";

export function validationErrorHandler(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
        return;
    }
    
    return res.status(400).json(JSONResponse.failure(errors.array()));
}

export function routeErrorHandler(err: any, req: Request, res: Response, next: NextFunction){
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            const errMsg = "Database error: unique constraint failed";
            res.json(JSONResponse.failure(err.meta, errMsg));
            return;
    }
    else if(err instanceof JSONResponse){
        res.status(err.statusCode).json(err);
        return;
    }
    
    res.status(400).json(err);
}