import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import z from 'zod';
import errorGenerator from '../utils/error-generator';

exports.verify = (req: Request, res: Response, next: NextFunction) => {
    const bodySchema = z.object(
        {
            username: z.string({
                required_error: 'Please provide a username.',
                invalid_type_error: 'Please provide a valide username'
            }),
            password: z.string({
                required_error: 'Please provide a password.',
                invalid_type_error: 'Please provide a valide password.'
            })
        },
        { required_error: 'Please provide authentication parameters.' }
    );
    const authenticationVariables = bodySchema.safeParse(req.body);
    if (!authenticationVariables.success) {
        return errorGenerator(
            authenticationVariables.error.errors[0].message,
            422,
            next
        );
    }
    if (
        req.body.username === process.env.ADMIN_USERNAME &&
        req.body.password === process.env.ADMIN_PASSWORD
    ) {
        const token = jwt.sign(
            {
                username: authenticationVariables.data.username,
                password: authenticationVariables.data.password
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '10h'
            }
        );
        res.status(200).json({
            message: 'Successful authentication.',
            token: token
        });
        return;
    }
    return errorGenerator('Failed authentication.', 401, next);
};
