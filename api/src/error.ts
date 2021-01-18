import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    winston.warn('Not found');

    const error = new HttpException(404, 'Not Found');

    next(error);
};

export const catchAll = (err: HttpException, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Something broke';

    winston.error(message);

    res.status(status).json({ error: { message } });
};
