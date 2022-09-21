import express from 'express';
import {
    addIngredient,
    addQuantity,
    addFood,
    addLiquid,
    deleteFood,
    deleteIngredient,
    deleteLiquid,
    confirmOrder
} from '../controllers/admin';
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

// PATCH admin/add-quantity
// must send:
// {
//     "ingredient": {
//          "id": number (Integer),
//          "quantity": number (Integer)
//      },
// }
adminRouter.patch('/add-quantity', addQuantity);

// POST admin/add-food
// must send:
// {
//     "food": {
//          "name": string
//          "price": number
//          "category": "1" | "2" | "3" (String literal)
//          "ingredients": [
//              {
//                  "id": number (Integer)
//                  "amount": number (Integer)
//              }
//          ]
//      },
// }
adminRouter.post('/add-food', addFood);

// POST admin/add-liquid
// must send:
// {
//     "liquid": {
//          "name": string
//          "price": number
//      },
// }
adminRouter.post('/add-liquid', addLiquid);

// DELETE admin/delete-food
// must send:
// {
//     "foodId": number (Integer)
// }
adminRouter.delete('/delete-food', deleteFood);

// DELETE admin/delete-ingredient
// must send:
// {
//     "ingredientId": number (Integer)
// }
adminRouter.delete('/delete-ingredient', deleteIngredient);

// DELETE admin/delete-liquid
// must send:
// {
//     "liquidId": number (Integer)
// }
adminRouter.delete('/delete-liquid', deleteLiquid);

//POST admin/confirm-order
// must send:
// {
//     "order": {
//          "id": number (Integer)
//          "ingredientsToExclude": number[] (Integer) (optional) (if exists, at least 1 element in array)
//      },
// }
adminRouter.patch('/confirm-order', confirmOrder);

export default adminRouter;
