import { configureStore } from '@reduxjs/toolkit';
import orderSlice from './order-slice';
import loginSlice from './login-slice';

const store = configureStore({
    reducer: { order: orderSlice.reducer, login: loginSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
