import { configureStore } from '@reduxjs/toolkit';
import orderSlice from './order-slice';
import loginSlice from './login-slice';
import foodSlice from './food-slice';

const store = configureStore({
    reducer: {
        order: orderSlice.reducer,
        login: loginSlice.reducer,
        food: foodSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
