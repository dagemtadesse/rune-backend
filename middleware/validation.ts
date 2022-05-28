import { body } from "express-validator";
import { validationErrorHandler } from "./errors";

export const registrationValidations = [
    body('fullname').isLength({ min: 4 }),

    body('email')
        .isEmail(),

    body('password')
        .isLength({min: 8}),

    validationErrorHandler
];

// TODO implementation
export const loginValidations = [
    body('email')
        .isString(),

    body('password')
        .isString(),

    validationErrorHandler
];

// export const 
