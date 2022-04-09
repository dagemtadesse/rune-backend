import { body } from "express-validator";
import { validationErrorHandler } from "./errors";

export const registrationValidations = [
    body('fullname').isLength({ min: 4 }),

    body('handle')
        .isLength({ min: 3 }),

    body('email')
        .isEmail(),

    body('password')
        .isStrongPassword({
            minLength: 8,
            minUppercase: 1,
            minSymbols: 1
        })
        .withMessage("Password must be a minimum length of 8 and contain uppercase and a special symbol"),

    validationErrorHandler
];

// TODO implementation
export const loginValidations = [
    body('handle')
        .isString(),

    body('password')
        .isString(),

    validationErrorHandler
];
