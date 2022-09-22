import { NextFunction, Request, Response } from 'express';
import errorGenerator from '../utils/error-generator';
import prisma from '../database/prisma-db';
import { z } from 'zod';

export const fetchFood = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let foods;
    let ingredients: { id: number }[];
    try {
        foods = await prisma.food.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                category: true,
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
        ingredients = await prisma.ingredient.findMany({
            where: {
                quantity: {
                    gte: 10
                }
            },
            select: {
                id: true
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    const refinedFood: {
        id: number;
        name: string;
        price: number;
        category: string;
        FoodIngredient: {
            amount: number;
            ingredient: {
                id: number;
                name: string;
            };
        }[];
    }[] = [];
    foods.forEach(food => {
        let compromisedFood = false;
        food.FoodIngredient.forEach(foodIngredient => {
            if (
                ingredients.findIndex(
                    ingredient => ingredient.id === foodIngredient.ingredient.id
                ) === -1
            ) {
                compromisedFood = true;
            }
        });
        if (!compromisedFood) {
            refinedFood.push(food);
        }
    });
    return res.status(200).json({ foods: refinedFood });
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
export const createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodySchema = z.object({
        order: z.object(
            {
                name: z
                    .string({
                        required_error: 'Please provide a name.',
                        invalid_type_error: 'Please provide a valid name.'
                    })
                    .min(1, 'Please provide a name that is not empty.'),
                surname: z
                    .string({
                        required_error: 'Please provide a surname.',
                        invalid_type_error: 'Please provide a valid surname.'
                    })
                    .min(1, 'Please provide a surname that is not empty.'),
                numberOfPeople: z
                    .number({
                        required_error: 'Please provide a number of people.',
                        invalid_type_error:
                            'Please provide a valid number of people.'
                    })
                    .int(
                        'Please provide an integer number for the number of people.'
                    ),
                description: z
                    .string({
                        invalid_type_error: 'Please provide a valid description'
                    })
                    .optional(),
                foods: z
                    .array(
                        z.object({
                            id: z
                                .number({
                                    required_error: 'Please provide a id.',
                                    invalid_type_error:
                                        'Please provide a valid id.'
                                })
                                .int('Please provide an integer for id.'),
                            quantity: z
                                .number({
                                    required_error:
                                        'Please provide a quantity.',
                                    invalid_type_error:
                                        'Please provide a valid quantity.'
                                })
                                .positive(
                                    'Please provide a quantity greater than 0.'
                                )
                                .int('Please provide an integer for quantity.'),
                            description: z
                                .string({
                                    invalid_type_error:
                                        'Please provide a valid description'
                                })
                                .optional()
                        }),
                        {
                            invalid_type_error: 'Please provide valid foods.',
                            required_error: 'Please provide a list of food.'
                        }
                    )
                    .min(1, 'Please provide at least a food.')
                    .optional(),
                liquids: z
                    .array(
                        z.object({
                            id: z
                                .number({
                                    required_error: 'Please provide a id.',
                                    invalid_type_error:
                                        'Please provide a valid id.'
                                })
                                .int('Please provide an integer for id.'),
                            quantity: z
                                .number({
                                    required_error:
                                        'Please provide a quantity.',
                                    invalid_type_error:
                                        'Please provide a valid quantity.'
                                })
                                .int('Please provide an integer for quantity.'),
                            description: z
                                .string({
                                    invalid_type_error:
                                        'Please provide a valid description'
                                })
                                .optional()
                        }),
                        {
                            invalid_type_error: 'Please provide valid liquids.',
                            required_error: 'Please provide a list of liquid.'
                        }
                    )
                    .min(1, 'Please provide at least a liquid.')
                    .optional()
            },
            {
                required_error: 'Please provide an order.',
                invalid_type_error: 'Please provide a valid order.'
            }
        )
    });
    const orderToAdd = bodySchema.safeParse(req.body);
    if (!orderToAdd.success) {
        return errorGenerator(orderToAdd.error.errors[0].message, 422, next);
    }
    //Prepared the standard part of the order.
    const buildedQuery: {
        name: string;
        surname: string;
        numberOfPeople: number;
        status: string;
        description: string;
        OrderFood?: {
            createMany: { data: { foodId: number; quantity: number }[] };
        };
        OrderLiquid?: {
            createMany: { data: { liquidId: number; quantity: number }[] };
        };
        totalPrice?: number;
    } = {
        name: orderToAdd.data.order.name,
        surname: orderToAdd.data.order.surname,
        numberOfPeople: orderToAdd.data.order.numberOfPeople,
        status: 'PENDING',
        description: orderToAdd.data.order.description || ''
    };
    //EXAMPLE OF HOW TO SET UP MULTIPLE FOODS AND LIQUIDS
    // OrderFood: {
    //     createMany: {
    //         data: [
    //             {
    //                 foodId: 2,
    //                 quantity: 3
    //             }
    //         ]
    //     }
    // },
    // OrderLiquid: {
    //     createMany: {
    //         data: [
    //             {
    //                 liquidId: 1,
    //                 quantity: 3
    //             }
    //         ]
    //     }
    // }
    //If foods are defined, then they are attached to the standard query.
    // + finding their prices.
    let foodsPrices;
    if (orderToAdd.data.order.foods) {
        try {
            foodsPrices = await prisma.food.findMany({
                where: {
                    id: {
                        in: orderToAdd.data.order.foods.map(food => food.id)
                    }
                },
                select: {
                    price: true
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                return errorGenerator('Internal server error', 500, next);
            }
            return errorGenerator('Internal server error', 500, next);
        }
        buildedQuery.OrderFood = {
            createMany: {
                data: orderToAdd.data.order.foods.map(food => {
                    return {
                        foodId: food.id,
                        quantity: food.quantity,
                        description: food.description || ''
                    };
                })
            }
        };
    }
    //If liquids are defined, then they are attached to the standard query.
    // + finding their prices.
    let liquidsPrices;
    if (orderToAdd.data.order.liquids) {
        try {
            liquidsPrices = await prisma.liquid.findMany({
                where: {
                    id: {
                        in: orderToAdd.data.order.liquids.map(
                            liquid => liquid.id
                        )
                    }
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                return errorGenerator('Internal server error', 500, next);
            }
            return errorGenerator('Internal server error', 500, next);
        }
        buildedQuery.OrderLiquid = {
            createMany: {
                data: orderToAdd.data.order.liquids.map(liquid => {
                    return {
                        liquidId: liquid.id,
                        quantity: liquid.quantity,
                        description: liquid.description || ''
                    };
                })
            }
        };
    }
    let totalPrice = 0;
    if (foodsPrices && foodsPrices.length > 0) {
        totalPrice += foodsPrices.reduce((prev, curr) => prev + curr.price, 0);
    }
    if (liquidsPrices && liquidsPrices.length > 0) {
        totalPrice += liquidsPrices.reduce(
            (prev, curr) => prev + curr.price,
            0
        );
    }
    buildedQuery.totalPrice = parseFloat(totalPrice.toFixed(2));
    let addedOrder;
    try {
        addedOrder = await prisma.order.create({
            data: buildedQuery
        });
    } catch (error) {
        if (error instanceof Error) {
            return errorGenerator('Internal server error', 500, next);
        }
        return errorGenerator('Internal server error', 500, next);
    }
    return res
        .status(200)
        .json({ message: 'Order created successfully.', order: addedOrder });
};

export const fetchOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bodySchema = z.object({
        order: z.object(
            {
                id: z
                    .number({
                        required_error: 'Please provide an id.',
                        invalid_type_error: 'Please provide a valid id.'
                    })
                    .int('Please provide an integer for id.')
            },
            {
                required_error: 'Please provide a order',
                invalid_type_error: 'Please provide a valid order.'
            }
        )
    });
    const orderToFetch = bodySchema.safeParse(req.body);
    if (!orderToFetch.success) {
        return errorGenerator(orderToFetch.error.errors[0].message, 422, next);
    }
    let orderFetched;
    try {
        orderFetched = await prisma.order.findFirst({
            where: {
                id: orderToFetch.data.order.id
            },
            include: {
                OrderFood: {
                    include: {
                        food: {
                            include: {
                                FoodIngredient: {
                                    select: {
                                        amount: true,
                                        ingredientId: true
                                    }
                                }
                            }
                        }
                    }
                },
                OrderLiquid: {
                    include: {
                        liquid: true
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
    if (!orderFetched) {
        return errorGenerator('Order not found.', 404, next);
    }
    let orderedFoodReOrganized = orderFetched.OrderFood.map(orderFood => {
        return {
            orderFoodId: orderFood.id,
            quantity: orderFood.quantity,
            name: orderFood.food.name,
            foodId: orderFood.food.id,
            price: orderFood.food.price,
            description: orderFood.description,
            foodIngredients: orderFood.food.FoodIngredient
        };
    });
    let orderedLiquidReOrganized = orderFetched.OrderLiquid.map(orderLiquid => {
        return {
            orderLiquidId: orderLiquid.id,
            quantity: orderLiquid.quantity,
            name: orderLiquid.liquid.name,
            liquidId: orderLiquid.liquid.id,
            description: orderLiquid.description,
            price: orderLiquid.liquid.price
        };
    });
    const orderReOrganized = {
        ...orderFetched,
        OrderFood: orderedFoodReOrganized,
        OrderLiquid: orderedLiquidReOrganized
    };
    return res.status(200).json({
        message: 'Order fetched successfully.',
        order: orderReOrganized
    });
};
