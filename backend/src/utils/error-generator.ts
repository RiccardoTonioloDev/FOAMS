import { NextFunction } from 'express';
import { ZodError } from 'zod';
import customError, { ZodGeneratedError } from '../../types/customError';

const errorGenerator = (
    message: string,
    statusCode: number,
    next: NextFunction
) => {
    const newError = new Error(message) as customError;
    newError.statusCode = statusCode;
    return next(newError);
};

export default errorGenerator;
