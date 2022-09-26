import { createSlice } from '@reduxjs/toolkit';

type initialStateType = {
    logged: boolean;
    token: string;
};

const initialState: initialStateType = {
    logged: false,
    token: '',
};

const loginSlice = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {
        login(state, action) {
            localStorage.setItem('token', action.payload);
            const actualDate = Date.now();
            const whenToExpire = actualDate + 7 * 60 * 60 * 1000;
            localStorage.setItem(
                'expirationDate',
                new Date(whenToExpire).toString()
            );
            state.token = action.payload;
            state.logged = true;
        },
        logout(state, action) {
            localStorage.removeItem('token');
            localStorage.removeItem('expirationDate');
            state.logged = false;
            state.token = '';
        },
        logInIfFound(state, action) {
            const token = localStorage.getItem('token');
            const expirationDate = localStorage.getItem('expirationDate');
            if (token && expirationDate) {
                const millisecondsToExpire =
                    Date.parse(expirationDate) - Date.now();
                if (millisecondsToExpire <= 2000) {
                    return;
                }
                state.token = token;
                state.logged = true;
            }
        },
    },
});

export const loginActions = loginSlice.actions;
export default loginSlice;
