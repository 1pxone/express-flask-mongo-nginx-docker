import { UserModel } from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { getPasswordHash } from '../utils/password-hash';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../middlewares/jwt';

const refreshTokenSecret = 'somerandomstringforrefreshtoken';
let refreshTokens: string[] = [];

export const userController = {
    check: async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            throw Error('User not found');
        }
        next();
    },
    create: async (req: Request, res: Response) => {
        const { email, password: passwordWeak, name } = req.body;
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            const password = await getPasswordHash(passwordWeak);
            const newUser = await UserModel.createUser({ email, password, name });
            const accessToken = jwt.sign({ email }, SECRET_KEY, {
                expiresIn: '20m',
            });
            const refreshToken = jwt.sign({ email }, refreshTokenSecret);

            // @TODO: Provide refresh token to client
            refreshTokens.push(refreshToken);
            res.setHeader('authorization', accessToken);
            res.json(newUser);
        } else {
            throw Error('Что-то пошло не так...');
        }
    },
    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await UserModel.getUserByEmail(email);
        if (user) {
            // generate an access token
            const accessToken = jwt.sign({ email: user.email }, SECRET_KEY, {
                expiresIn: '20m',
            });
            const refreshToken = jwt.sign({ email: user.email }, refreshTokenSecret);

            refreshTokens.push(refreshToken);

            res.json({
                accessToken,
                refreshToken,
            });
        } else {
            res.send('email or password incorrect');
        }
    },
    refreshToken: async (req: Request, res: Response) => {
        const { token } = req.body;

        if (!token) {
            return res.sendStatus(401);
        }

        if (!refreshTokens.includes(token)) {
            return res.sendStatus(403);
        }

        jwt.verify(token, refreshTokenSecret, (err: any, user: { email: any }) => {
            if (err) {
                return res.sendStatus(403);
            }

            const accessToken = jwt.sign({ email: user.email }, SECRET_KEY, {
                expiresIn: '20m',
            });

            res.json({
                accessToken,
            });
        });
    },
    logout: async (req: Request, res: Response) => {
        const { token } = req.body;
        refreshTokens = refreshTokens.filter((t) => t !== token);

        res.send('Logout successful');
    },
    remove: async (req: Request & { email: string }, res: Response) => {
        const email = req.email;
        const user = await UserModel.getUserByEmail(email);
        if (user?._id === req.params.id) {
            await UserModel.findByIdAndRemove(req.params.id);

            res.json({
                success: true,
                id: req.params.id,
            });
        } else {
            res.status(403).json({
                success: false,
            });
        }
    },
    list: async (req: Request, res: Response) => {
        const users = await UserModel.find();

        res.json(users);
    },
    update: async (req: Request & { email: string }, res: Response) => {
        const email = req.email;
        const user = await UserModel.getUserByEmail(email);
        if (user?._id === req.params.id) {
            const user = await UserModel.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
            }).exec();

            res.json(user);
        } else {
            res.status(403).json({
                success: false,
            });
        }
    },
    view: async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.params.id);

        res.json(user);
    },
};
