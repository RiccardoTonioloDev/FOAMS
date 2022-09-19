import { NextFunction, Request, Response } from 'express';
import errorGenerator from '../utils/error-generator';
import prisma from '../database/prisma-db';

export const fetchFood = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let foods;
    try {
        foods = await prisma.food.findMany({
            select: {
                id: true,
                name: true,
                FoodIngredient: {
                    select: {
                        amount: true,
                        ingredient: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res.status(200).json({ foods: foods });
};

export const fetchIngredients = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let ingredients;
    try {
        ingredients = await prisma.ingredient.findMany({
            select: {
                id: true,
                name: true
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res.status(200).json({ ingredients: ingredients });
};
export const fetchLiquids = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let liquids;
    try {
        liquids = await prisma.liquid.findMany({
            select: {
                id: true,
                name: true,
                price: true
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res.status(200).json({ liquids: liquids });
};
