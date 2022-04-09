import express from 'express';

import {authenticateUser, registerUser} from '../middleware/auth';
import { registrationValidations, loginValidations } from '../middleware/validation';
import { issueJWT } from '../middleware/jwt';

const authRouter = express.Router();

// register and return JWT token
// validate the requestBody using newUserValidations middleware then authenticate
// and send jwt token to the response
authRouter.post('/user', ...registrationValidations, registerUser, issueJWT, (req, res) => {
    res.status(301).json({token: res.locals.token})
});

// login and return JWT token
// validate the requestBody using loginValidations middleware then authenticate
// and send jwt token to the response
authRouter.get("/user-token", ...loginValidations, authenticateUser, issueJWT, (req, res) => {
    res.status(200).json({token: res.locals.token})
});

export default authRouter;