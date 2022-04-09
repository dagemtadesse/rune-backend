import  {validationResult} from "express-validator";
import {Request, Response, NextFunction} from 'express';

// TODO implementation
export function validationErrorHandler(req: Request, res: Response, next: NextFunction){
    const errors = validationResult(req);

    if(errors.isEmpty()){
        next();
        return;
    }

    return res.status(400).json({
        success: false,
        errors: errors.array()
    });

}