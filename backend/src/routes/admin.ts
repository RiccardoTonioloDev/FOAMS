import express from 'express';
import { addIngredient, addQuantity, addFood } from '../controllers/admin';
const adminRouter = express.Router();

// POST admin/add-ingredient
// must send:
// {
//     "ingredient": {
//          "name": string,
//          "quantity": number (Integer)
//      },
// }
adminRouter.post('/add-ingredient', addIngredient);
// POST admin/add-quantity
// must send:
// {
//     "ingredient": {
//          "id": number (Integer),
//          "quantity": number (Integer)
//      },
// }
adminRouter.post('/add-quantity', addQuantity);
// POST admin/add-quantity
// must send:
// {
//     "food": {
//          "name": string
//          "price": number
//          "ingredients": [
//              "id": number (Integer)
//              "amount": number (Integer)
//          ]
//      },
// }
adminRouter.post('/add-food', addFood);

export default adminRouter;
