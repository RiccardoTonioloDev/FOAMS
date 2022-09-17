import { NextFunction, Request, Response } from 'express';
import customError from '../../types/customError';
import jwt from 'jsonwebtoken';

export const barrier = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error(
            'Not authenticated. Please verify first.'
        ) as customError;
        error.statusCode = 401;
        return next(error);
    }
    const token = authHeader.split(' ')[1];

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        if (error instanceof Error) {
            const customError = error as customError;
            customError.statusCode = 500;
            customError.message = 'Internal server error.';
            return next(customError);
        }
    }

    if (!decodedToken) {
        const error = new Error(
            'Not authenticated. Please verify first.'
        ) as customError;
        error.statusCode = 401;
        return next(error);
    }
    req.body.verified = true;
    next();
};
