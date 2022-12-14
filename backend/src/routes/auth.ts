import express from 'express';

//IMPORT CONTROLLERS
const authController = require('../controllers/auth');

//SETUP
const authRouter = express.Router();

// POST /auth/verify
// must send:
// {
//     "username": string,
//     "password": string
// }
authRouter.post('/verify', authController.verify);

export default authRouter;
