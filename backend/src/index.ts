import bodyParser from 'body-parser';
require('dotenv').config();

//LIBRARIES
import express, { NextFunction, Request, Response } from 'express';
//ROUTERS
import authRouter from './routes/auth';
import { barrier } from './middlewares/auth-barrier';
import customError from '../types/customError';

const app = express();

//PUBLIC - MIDDLEWARE
app.use(bodyParser.json());

//AUTH Verification
app.use('/auth', authRouter);

//AUTH Barrier
app.use('/admin', barrier);

//ADMIN - MIDDLEWARE

//ERROR HANDLING MIDDLEWARE
app.use((err: customError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.statusCode).json({ message: err.message });
});

app.listen(process.env.PORT, () => {
    console.log('Listening on port: ' + process.env.PORT);
});
