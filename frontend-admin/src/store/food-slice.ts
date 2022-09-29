import { createSlice } from '@reduxjs/toolkit';

type initialStateType = {
    name: string;
    price: number;
    category: '' | '1' | '2' | '3';
    ingredients: { id: number; amount: number }[];
};

const initialState: initialStateType = {
    name: '',
    price: 0,
    category: '',
    ingredients: [],
};

const foodSlice = createSlice({
    name: 'food',
    initialState: initialState,
    reducers: {
        changeName(state, action: { payload: string }) {
            state.name = action.payload;
        },
        changePrice(state, action: { payload: number }) {
            state.price = action.payload;
        },
        changeCategory(state, action: { payload: '1' | '2' | '3' }) {
            state.category = action.payload;
        },
        addIngredient(
            state,
            action: { payload: { id: number; amount: number } }
        ) {
            if (
                state.ingredients.findIndex(
                    (ingredient) => ingredient.id === action.payload.id
                ) !== -1
            )
                return;
            state.ingredients.push(action.payload);
        },
        modifyAmount(
            state,
            action: { payload: { id: number; amount: number } }
        ) {
            const Index = state.ingredients.findIndex(
                (ingredient) => ingredient.id === action.payload.id
            );
            if (Index === -1) return;
            state.ingredients[Index].amount += action.payload.amount;
            if (state.ingredients[Index].amount < 0) {
                state.ingredients = state.ingredients.filter(
                    (ingredient) => ingredient.id !== action.payload.id
                );
            }
        },
        removeIngredient(state, action: { payload: { id: number } }) {
            if (
                state.ingredients.findIndex(
                    (ingredient) => ingredient.id === action.payload.id
                ) === -1
            )
                return;
            state.ingredients = state.ingredients.filter(
                (ingredient) => ingredient.id !== action.payload.id
            );
        },
        resetFood(state, action) {
            state.category = '';
            state.ingredients = [];
            state.name = '';
            state.price = 0;
        },
    },
});

export const foodActions = foodSlice.actions;
export default foodSlice;
