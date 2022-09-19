import prisma from '../database/prisma-db';
import express, { Request, Response } from 'express';
import {
    createOrder,
    fetchFood,
    fetchIngredients,
    fetchLiquids
} from '../controllers/public';
const publicRouter = express.Router();

// GET /foods
publicRouter.get('/foods', fetchFood);
//GET /ingredients
publicRouter.get('/ingredients', fetchIngredients);
//GET /liquids
publicRouter.get('/liquids', fetchLiquids);
//POST /create-order
// must send:
// {
//     "order": {
//          "name": string (non empty)
//          "surname": string (non empty)
//          "numberOfPeople": number (Integer)
//          "description": string (optional)
//          "foods": [
//              {
//                  "id": number (Integer)
//                  "amount": number (Integer)
//              }
//          ] (optional) (non empty)
//          "liquids": [
//              {
//                  "id": number (Integer)
//                  "amount": number (Integer)
//              }
//          ] (optional) (non empty)
//      },
// }
publicRouter.post('/create-order', createOrder);

//IN CASE OF EMERGENCY (JUST TO CHECK OR FIX)
// publicRouter.use('/', async (req: Request, res: Response) => {
//     const prova = await prisma.foodIngredient.deleteMany();
//     res.status(200).json({ foodIngredient: prova });
// });

export default publicRouter;
