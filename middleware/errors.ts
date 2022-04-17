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
    console.log(err);

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            const errMsg = "Database error: unique constraint failed";
            const fields = err.meta as {target: any}
            res.json(JSONResponse.failure({fields: fields.target}, errMsg));
            return;
    }
    else if(err instanceof JSONResponse){
        res.status(err.statusCode).json(err);
        return;
    }

    // TODO: handle deletion of referenced items
    res.status(500).json(JSONResponse.error());
}