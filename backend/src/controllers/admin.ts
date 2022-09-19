import { NextFunction, Request, Response } from 'express';
import z, { ZodError, ZodLazy } from 'zod';
import prisma from '../database/prisma-db';
import errorGenerator from '../utils/error-generator';

export const addIngredient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodySchema = z.object({
        ingredient: z.object(
            {
                name: z
                    .string({
                        invalid_type_error: 'Please provide a valid name.',
                        required_error: 'Please provide a name.'
                    })
                    .min(1, { message: 'Please provide a valid name.' }),
                quantity: z
                    .number({
                        invalid_type_error: 'Please provide a valid quantity.',
                        required_error: 'Please provide a quantity.'
                    })
                    .int('Please provide an integer number for quantity.')
            },
            {
                required_error: 'Please provide an ingredient.',
                invalid_type_error: 'Please provide a valid ingredient.'
            }
        )
    });
    const ingredientToAdd = bodySchema.safeParse(req.body);
    if (!ingredientToAdd.success) {
        return errorGenerator(
            ingredientToAdd.error.errors[0].message,
            422,
            next
        );
    }
    //Request validation done
    let newIngredent;
    try {
        newIngredent = await prisma.ingredient.create({
            data: {
                name: ingredientToAdd.data.ingredient.name,
                quantity: ingredientToAdd.data.ingredient.quantity
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res.status(200).json({
        message: 'Ingredient added successfully.',
        ingredient: newIngredent
    });
};

export const addQuantity = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodySchema = z.object({
        ingredient: z.object(
            {
                quantity: z
                    .number({
                        required_error: 'Please provide a quantity.',
                        invalid_type_error: 'Please provide a valid quantity.'
                    })
                    .int('Pleease provide an integer for quantity.'),
                id: z
                    .number({
                        required_error: 'Please provide an id.',
                        invalid_type_error: 'Please provide a valid id.'
                    })
                    .int('Please provide an integer number for id.')
            },
            {
                required_error: 'Please provide an ingredient.',
                invalid_type_error: 'Please provide a valid ingredient.'
            }
        )
    });
    const ingredientToBeUpdated = bodySchema.safeParse(req.body);
    if (!ingredientToBeUpdated.success) {
        return errorGenerator(
            ingredientToBeUpdated.error.errors[0].message,
            422,
            next
        );
    }
    let updatedIngredient;
    try {
        updatedIngredient = await prisma.ingredient.update({
            where: {
                id: ingredientToBeUpdated.data.ingredient.id
            },
            data: {
                quantity: {
                    increment: ingredientToBeUpdated.data.ingredient.quantity
                }
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res.status(200).json({
        message: 'Successfully added quantity',
        item: updatedIngredient
    });
};

export const addFood = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodySchema = z.object({
        food: z.object(
            {
                name: z.string({
                    required_error: 'Please provide a name.',
                    invalid_type_error: 'Please provide a valid food name'
                }),
                price: z.number({
                    required_error: 'Please provide a price.',
                    invalid_type_error: 'Please provide a valid price.'
                }),
                ingredients: z
                    .array(
                        z.object(
                            {
                                id: z
                                    .number({
                                        required_error:
                                            'Please provide ingredient id.',
                                        invalid_type_error:
                                            'Please provide valid ingredient id.'
                                    })
                                    .int(
                                        'Please provide an integer id for ingredient.'
                                    ),
                                amount: z
                                    .number({
                                        required_error:
                                            'Please provide ingredient amount.',
                                        invalid_type_error:
                                            'Please provide a valid ingredient amount.'
                                    })
                                    .int('Please provide an integer amount.')
                            },
                            {
                                required_error: 'Please provide an ingredient',
                                invalid_type_error:
                                    'Please provide a valid ingredient'
                            }
                        ),
                        {
                            required_error: 'Please provide ingredients',
                            invalid_type_error:
                                'Please provide a valid listo of ingredients.'
                        }
                    )
                    .min(1, 'Please provide at least an ingredient id.')
            },
            {
                required_error: 'Please provide a food.',
                invalid_type_error: 'Please provide a valid food.'
            }
        )
    });
    const foodToAdd = bodySchema.safeParse(req.body);
    if (!foodToAdd.success) {
        return errorGenerator(foodToAdd.error.errors[0].message, 422, next);
    }
    const createManyFoodIngredientData = foodToAdd.data.food.ingredients.map(
        ingredient => {
            return { ingredientId: ingredient.id, amount: ingredient.amount };
        }
    );
    let addedFood;
    try {
        addedFood = await prisma.food.create({
            data: {
                name: foodToAdd.data.food.name,
                price: foodToAdd.data.food.price,
                FoodIngredient: {
                    createMany: {
                        data: createManyFoodIngredientData
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
    return res
        .status(200)
        .json({ message: 'Food created successfully.', food: addedFood });
};

export const addLiquid = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodySchema = z.object({
        liquid: z.object(
            {
                name: z.string({
                    required_error: 'Please provide a name.',
                    invalid_type_error: 'Please provide a valid name'
                }),
                price: z.number({
                    required_error: 'Please provide a price.',
                    invalid_type_error: 'Please provide a valid price'
                })
            },
            {
                invalid_type_error: 'Please provide a valid liquid.',
                required_error: 'Please provide a liquid.'
            }
        )
    });
    const liquidToAdd = bodySchema.safeParse(req.body);
    if (!liquidToAdd.success) {
        return errorGenerator(liquidToAdd.error.errors[0].message, 422, next);
    }
    let addedLiquid;
    try {
        addedLiquid = await prisma.liquid.create({
            data: {
                name: liquidToAdd.data.liquid.name,
                price: liquidToAdd.data.liquid.price
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res
        .status(200)
        .json({ message: 'Liquid added successfully.', liquid: addedLiquid });
};

export const deleteFood = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodySchema = z.object({
        foodId: z
            .number({
                required_error: 'Please provide a foodId.',
                invalid_type_error: 'Please provide a valid foodId'
            })
            .int('Please provide an Integer for foodId.')
    });
    const foodToDelete = bodySchema.safeParse(req.body);
    if (!foodToDelete.success) {
        return errorGenerator(foodToDelete.error.errors[0].message, 422, next);
    }
    let deletedFood;
    try {
        const fetchFoodIngredientsToDelete = await prisma.foodIngredient.findMany(
            {
                where: {
                    foodId: foodToDelete.data.foodId
                }
            }
        );
        const fetchOrderFoodToDelete = await prisma.orderFood.findMany({
            where: {
                foodId: foodToDelete.data.foodId
            }
        });
        deletedFood = await prisma.$transaction([
            prisma.foodIngredient.deleteMany({
                where: {
                    id: {
                        in: fetchFoodIngredientsToDelete.map(
                            foodIngredient => foodIngredient.id
                        )
                    }
                }
            }),
            prisma.orderFood.deleteMany({
                where: {
                    id: {
                        in: fetchOrderFoodToDelete.map(
                            orderFood => orderFood.id
                        )
                    }
                }
            }),
            prisma.food.delete({
                where: {
                    id: foodToDelete.data.foodId
                }
            })
        ]);
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res
        .status(200)
        .json({ message: 'Deleted food successfully.', food: deletedFood[2] });
};

export const deleteIngredient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodySchema = z.object({
        ingredientId: z
            .number({
                required_error: 'Please provide a ingredientId.',
                invalid_type_error: 'Please provide a valid ingredientId'
            })
            .int('Please provide an Integer for ingredientId.')
    });
    const ingredientToDelete = bodySchema.safeParse(req.body);
    if (!ingredientToDelete.success) {
        return errorGenerator(
            ingredientToDelete.error.errors[0].message,
            422,
            next
        );
    }
    let deletedIngredient;
    try {
        const foodIngredientsToDelete = await prisma.foodIngredient.findMany({
            where: {
                ingredientId: ingredientToDelete.data.ingredientId
            }
        });
        const foodToDelete = await prisma.food.findMany({
            where: {
                id: {
                    in: foodIngredientsToDelete.map(
                        foodIngredient => foodIngredient.foodId
                    )
                }
            }
        });
        const foodToDeleteIds = foodToDelete.map(food => food.id);
        const foodIngredientToDeleteBecauseOfFoodDelete = await prisma.foodIngredient.findMany(
            {
                where: {
                    AND: [
                        {
                            foodId: {
                                in: foodToDeleteIds
                            }
                        },
                        {
                            ingredientId: {
                                not: ingredientToDelete.data.ingredientId
                            }
                        }
                    ]
                }
            }
        );
        const fetchOrderFoodToDelete = await prisma.orderFood.findMany({
            where: {
                foodId: {
                    in: foodToDeleteIds
                }
            }
        });
        deletedIngredient = await prisma.$transaction([
            prisma.foodIngredient.deleteMany({
                where: {
                    id: {
                        in: foodIngredientToDeleteBecauseOfFoodDelete
                            .concat(foodIngredientsToDelete)
                            .map(foodIngredient => foodIngredient.id)
                    }
                }
            }),
            prisma.ingredient.deleteMany({
                where: {
                    id: ingredientToDelete.data.ingredientId
                }
            }),
            prisma.orderFood.deleteMany({
                where: {
                    id: {
                        in: fetchOrderFoodToDelete.map(
                            orderFood => orderFood.id
                        )
                    }
                }
            }),
            prisma.food.deleteMany({
                where: {
                    id: {
                        in: foodToDeleteIds
                    }
                }
            })
        ]);
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res.status(200).json({
        message: 'Ingredient deleted successfully.',
        ingredient: deletedIngredient[1]
    });
};

export const deleteLiquid = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodySchema = z.object({
        liquidId: z
            .number({
                required_error: 'Please provide a liquidId.',
                invalid_type_error: 'Please provide a valid liquidId.'
            })
            .int('Please provide an Integer for liquidId.')
    });
    const liquidToDelete = bodySchema.safeParse(req.body);
    if (!liquidToDelete.success) {
        return errorGenerator(
            liquidToDelete.error.errors[0].message,
            422,
            next
        );
    }
    let deletedLiquid;
    try {
        deletedLiquid = await prisma.$transaction([
            prisma.orderLiquid.deleteMany({
                where: {
                    liquidId: liquidToDelete.data.liquidId
                }
            }),
            prisma.liquid.delete({
                where: {
                    id: liquidToDelete.data.liquidId
                }
            })
        ]);
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res.status(200).json({
        message: 'Liquid deleted successfully.',
        liquid: deletedLiquid[1]
    });
};
