import express from 'express';
import { fetchFood, fetchIngredients } from '../controllers/public';
const publicRouter = express.Router();

// GET /food
publicRouter.get('/food', fetchFood);
//GET /ingredients
publicRouter.get('/ingredients', fetchIngredients);

export default publicRouter;
