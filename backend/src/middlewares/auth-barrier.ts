import { NextFunction, Request, Response } from 'express';
import customError from '../../types/customError';
import jwt from 'jsonwebtoken';
import errorGenerator from '../utils/error-generator';

export const barrier = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error(
            'Not authenticated or wrong API endpoint. Please verify first.'
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
            customError.message =
                'Internal server error or unauthenticated or wrong API endpoint.';
            return next(customError);
        }
    }

    if (!decodedToken) {
        return errorGenerator(
            'Not authenticated or wrong API endpoint. Please verify first.',
            401,
            next
        );
    }
    req.body.verified = true;
    next();
};
