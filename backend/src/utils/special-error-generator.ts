import { Ingredient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import prisma from '../database/prisma-db';
import errorGenerator from './error-generator';

type order = {
    OrderFood: {
        id: number;
        description: string;
        quantity: number;
        food: {
            name: string;
            FoodIngredient: {
                amount: number;
                ingredientId: number;
            }[];
            price: number;
        };
    }[];
    OrderLiquid: {
        description: string;
        quantity: number;
        liquid: {
            name: string;
            price: number;
        };
    }[];
};

const specialErrorGenerator = async (
    order: order,
    subZQtyIngr: Ingredient[],
    res: Response,
    next: NextFunction
) => {
    const customMessages: string[] = [];
    await order.OrderFood.forEach(async orderFood => {
        let incriminatedFood = false;
        let newOrderFoodMessage = '';
        await orderFood.food.FoodIngredient.forEach(async foodIngredient => {
            const indexOfIngredient = subZQtyIngr.findIndex(
                subZQI => subZQI.id === foodIngredient.ingredientId
            );
            if (indexOfIngredient !== -1) {
                incriminatedFood = true;
                customMessages.push(
                    `The ingredient: '${
                        subZQtyIngr[indexOfIngredient].name
                    }' isn't available for the food '${orderFood.food.name}'`
                );
                newOrderFoodMessage += `; no ${
                    subZQtyIngr[indexOfIngredient].name
                }`;
            }
        });
        if (incriminatedFood) {
            try {
                const oldDescription = await prisma.orderFood.findFirst({
                    where: {
                        id: orderFood.id
                    },
                    select: {
                        description: true
                    }
                });
                const updateDescription = await prisma.orderFood.update({
                    where: {
                        id: orderFood.id
                    },
                    data: {
                        description:
                            oldDescription!.description + newOrderFoodMessage
                    }
                });
            } catch (error) {
                if (error instanceof Error) {
                    return errorGenerator('Internal server error', 500, next);
                }
                return errorGenerator('Internal server error', 500, next);
            }
        }
    });
    return res.status(410).json({
        message: 'Some ingredients are no-more available',
        messages: customMessages,
        subZeroIngredients: subZQtyIngr
    });
};

export default specialErrorGenerator;
