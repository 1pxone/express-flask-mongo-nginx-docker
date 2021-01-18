import express from 'express';
import { userController } from '../contollers/user.controller';
import { catchErrors } from '../utils/catch-errors';
import { decode } from '../middlewares/jwt';

const { check, create, remove, list, update, view } = userController;

export const userRouter = express.Router();

userRouter.route('/').get(catchErrors(list)).post(catchErrors(create));

userRouter
    .route('/:id')
    .get(catchErrors(check), catchErrors(view))
    .put(catchErrors(decode), catchErrors(check), catchErrors(update))
    .delete(catchErrors(decode), catchErrors(check), catchErrors(remove));
