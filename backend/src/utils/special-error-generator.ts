import { Ingredient } from '@prisma/client';
import { Response } from 'express';

type order = {
    OrderFood: {
        quantity: number;
        id: number;
        food: {
            name: string;
            FoodIngredient: {
                amount: number;
                ingredientId: number;
            }[];
            price: number;
        };
        description: string | null;
    }[];
};

const specialErrorGenerator = async (
    order: order,
    subZQtyIngr: Ingredient[],
    res: Response
) => {
    const customMessages: string[] = [];
    let newDescription = '';
    order.OrderFood.forEach(orderFood => {
        orderFood.food.FoodIngredient.forEach(foodIngredient => {
            const indexOfIngredient = subZQtyIngr.findIndex(
                subZQI => subZQI.id === foodIngredient.ingredientId
            );
            if (indexOfIngredient !== -1) {
                customMessages.push(
                    `The ingredient: '${
                        subZQtyIngr[indexOfIngredient].name
                    }' isn't available for the food '${orderFood.food.name}'`
                );
                // const newDescription = `no ${subZQtyIngr[indexOfIngredient].name}; `;
                // const oldDescription =  await prisma.findM
            }
        });
    });
    return res.status(410).json({
        message: 'Some ingredients are no-more available',
        messages: customMessages,
        subZeroIngredients: subZQtyIngr,
        newDescription: newDescription
    });
};

export default specialErrorGenerator;
