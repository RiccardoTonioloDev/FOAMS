import bodyParser from 'body-parser';
require('dotenv').config();

//LIBRARIES
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
//ROUTERS
import authRouter from './routes/auth';
import { barrier } from './middlewares/auth-barrier';
import customError from '../types/customError';
import adminRouter from './routes/admin';
import publicRouter from './routes/public';
import cors from 'cors';

const app = express();

//LIB - MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

//PUBLIC - MIDDLEWARE
app.use(publicRouter);

//AUTH Verification
app.use('/auth', authRouter);

//AUTH Barrier
app.use('/admin', barrier);

//ADMIN - MIDDLEWARE
app.use('/admin', adminRouter);

//404 not found MIDDLEWARE
app.use('/', (req: Request, res: Response) => {
    return res.status(404).json({ message: 'API endpoint not found.' });
});

//ERROR HANDLING MIDDLEWARE
app.use((err: customError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = 500;
    const message = 'Internal server error.';
    return res
        .status(err.statusCode || 500)
        .json({ message: err.message || message });
});

app.listen(process.env.PORT, () => {
    console.log('Listening on port: ' + process.env.PORT);
});
