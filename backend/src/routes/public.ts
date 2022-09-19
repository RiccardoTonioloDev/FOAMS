import express from 'express';
import {
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

export default publicRouter;
