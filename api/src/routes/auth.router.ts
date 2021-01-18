import express from 'express';
import { userController } from '../contollers/user.controller';
import { catchErrors } from '../utils/catch-errors';

const { create, login, logout, refreshToken } = userController;

export const authRouter = express.Router();

authRouter.route('/register').post(catchErrors(create));
authRouter.route('/login').post(catchErrors(login));
authRouter.route('/token').post(catchErrors(refreshToken));
authRouter.route('/logout').post(catchErrors(logout));
