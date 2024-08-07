import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
    token: !!localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        login(state, action)
        {
            state.token = action.payload;
            localStorage.setItem("token", JSON.stringify(action.payload))
        },
        logout(state)
        {
            state.token = null;
            localStorage.clear()
        },
    }
})


export const authActions = authSlice.actions

export default authSlice.reducer;