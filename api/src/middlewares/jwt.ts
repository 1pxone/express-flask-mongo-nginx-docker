import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { NextFunction, Request, Response } from 'express';

// @TODO: Move to .env
export const SECRET_KEY = 'somerandomaccesstoken';

export const encode = async (
    req: Request & { authToken: string },
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);

        const payload = {
            userId: user._id,
        };
        const authToken = jwt.sign(payload, SECRET_KEY);
        req.authToken = authToken;
        next();
    } catch (error) {
        return res.status(400).json({ success: false, message: error.error });
    }
};

export const decode = async (
    req: Request & { email: string },
    res: Response,
    next: NextFunction
) => {
    if (!req.headers['authorization']) {
        return res.status(400).json({ success: false, message: 'No access token provided' });
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY) as {
            email: string;
        };
        req.email = decoded.email;
        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
};
