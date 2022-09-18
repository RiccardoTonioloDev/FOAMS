import { ZodError } from 'zod';
export default interface customError extends Error {
    statusCode: number;
}
export interface ZodGeneratedError extends Error {
    message: { message: string }[];
}
