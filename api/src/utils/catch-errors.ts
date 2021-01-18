import { NextFunction, Request, Response } from 'express';

export const catchErrors = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
    return function (req: Request, res: Response, next: NextFunction) {
        return fn(req, res, next).catch(next);
    };
};
