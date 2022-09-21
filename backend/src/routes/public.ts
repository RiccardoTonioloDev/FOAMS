// import prisma from '../database/prisma-db';
import express, { Request, Response } from 'express';
import {
    createOrder,
    fetchFood,
    fetchIngredients,
    fetchLiquids,
    fetchOrder
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
//                  "description": string (optional)
//              }
//          ] (optional) (non empty)
//          "liquids": [
//              {
//                  "id": number (Integer)
//                  "amount": number (Integer)
//                  "description": string (optional)
//              }
//          ] (optional) (non empty)
//      },
// }
publicRouter.post('/create-order', createOrder);

//Left as a POST for clarity sake (and because it's simplier to
//add or change other params in case of necessity).
//POST /fetch-order
// must send:
// {
//     "order": {
//          "id": number (Integer)
//      },
// }
publicRouter.post('/fetch-order', fetchOrder);

//IN CASE OF EMERGENCY (JUST TO CHECK OR FIX)
// publicRouter.use('/', async (req: Request, res: Response) => {
//     const prova = await prisma.foodIngredient.deleteMany();
//     res.status(200).json({ foodIngredient: prova });
// });

export default publicRouter;
