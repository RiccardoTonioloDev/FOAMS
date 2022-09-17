import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

exports.verify = (req: Request, res: Response) => {
    if (
        req.body.username === process.env.ADMIN_USERNAME &&
        req.body.password === process.env.ADMIN_PASSWORD
    ) {
        const token = jwt.sign(
            {
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: '10h',
            }
        );
        res.status(200).json({
            message: 'Successful authentication.',
            token: token,
        });
        return;
    }
    res.status(401).json({ message: 'Failed authentication.' });
};
