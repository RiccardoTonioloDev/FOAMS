import { createSlice } from '@reduxjs/toolkit';
import { Food } from '../types/food';
import { Liquid } from '../types/liquids';
type orderItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    description?: string;
};
const initialState: {
    foods: orderItem[];
    liquids: orderItem[];
    name: string;
    surname: string;
    numberOfPeople: number;
    description: string;
} = {
    foods: [],
    liquids: [],
    name: '',
    surname: '',
    numberOfPeople: 0,
    description: '',
};

const orderSlice = createSlice({
    name: 'order',
    initialState: initialState,
    reducers: {
        addFoodToOrder(state, action) {
            const newFood: Food = action.payload;
            const existingItem = state.foods.find(
                (food) => food.id === newFood.id
            );
            if (!existingItem) {
                state.foods.push({
                    id: newFood.id,
                    quantity: 1,
                    price: newFood.price,
                    name: newFood.name,
                });
                return;
            }
            existingItem.quantity++;
        },
        setFoodDescription(
            state,
            action: { payload: { id: number; description: string } }
        ) {
            const foodId = action.payload.id;
            const existingItem = state.foods.find((food) => food.id === foodId);
            if (existingItem) {
                existingItem.description = action.payload.description;
            }
        },
        setLiquidDescription(state, action) {
            const liquidId = action.payload.id;
            const existingItem = state.liquids.find(
                (liquid) => liquid.id === liquidId
            );
            if (existingItem) {
                existingItem.description = action.payload.description;
            }
        },
        decreaseFoodFromOrder(state, action) {
            const idToDecrease = action.payload.id;
            const existingItem = state.foods.find(
                (food) => food.id === idToDecrease
            );
            if (!existingItem) {
                return;
            }
            if (existingItem.quantity === 1) {
                state.foods = state.foods.filter(
                    (food) => food.id !== idToDecrease
                );
                return;
            }
            existingItem.quantity--;
        },
        addLiquidToOrder(state, action) {
            const newLiquid: Liquid = action.payload;
            const existingItem = state.liquids.find(
                (liquid) => liquid.id === newLiquid.id
            );
            if (!existingItem) {
                state.liquids.push({
                    id: newLiquid.id,
                    quantity: 1,
                    price: newLiquid.price,
                    name: newLiquid.name,
                });
                return;
            }
            existingItem.quantity++;
        },
        decreaseLiquidFromOrder(state, action) {
            const idToDecrease = action.payload.id;
            const existingItem = state.liquids.find(
                (liquid) => liquid.id === idToDecrease
            );
            if (!existingItem) {
                return;
            }
            if (existingItem.quantity === 1) {
                state.liquids = state.liquids.filter(
                    (liquid) => liquid.id !== idToDecrease
                );
                return;
            }
            existingItem.quantity--;
        },
        setName(state, action) {
            state.name = action.payload;
        },
        setSurname(state, action) {
            state.surname = action.payload;
        },
        setDescription(state, action) {
            state.description = action.payload;
        },
        setNumberOfPeople(state, action) {
            state.numberOfPeople = +action.payload;
        },
        resetOrder(state, action) {
            state.foods = [];
            state.liquids = [];
            state.description = '';
            state.name = '';
            state.surname = '';
            state.numberOfPeople = 0;
        },
    },
});

export const orderActions = orderSlice.actions;
export default orderSlice;
