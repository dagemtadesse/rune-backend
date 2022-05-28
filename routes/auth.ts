import express from 'express';

import { authenticateUser, registerUser } from '../middleware/auth';
import { registrationValidations, loginValidations } from '../middleware/validation';
import { issueJWT } from '../middleware/jwt';
import JSONResponse from '../utils/response';
import { User } from '@prisma/client';

const authRouter = express.Router();

interface NewUser extends User{
    authenticationToken?: String
}
// register and return JWT token
// validate the requestBody using newUserValidations middleware then authenticate
// and send jwt token to the response
authRouter.post('/user', ...registrationValidations, registerUser, issueJWT, (req, res) => {
    const newUser: NewUser = res.locals.user;
    newUser.authenticationToken = res.locals.token;
    res.status(201)
        .json(JSONResponse.success(newUser));
});

// login and return JWT token
// validate the requestBody using loginValidations middleware then authenticate
// and send jwt token to the response
authRouter.post("/auth-token", ...loginValidations, authenticateUser, issueJWT, (req, res) => {
    const newUser: NewUser = res.locals.user;
    newUser.authenticationToken = res.locals.token;
    res.status(200)
        .json(JSONResponse.success(newUser));
});

export default authRouter;