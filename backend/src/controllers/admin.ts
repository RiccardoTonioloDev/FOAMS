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
