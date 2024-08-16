import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../apis/authApi";
import AsyncStorage from '@react-native-async-storage/async-storage';

const authSlice = createSlice({
    name: "authSlice",
    initialState: { user: null },
    reducers: {},
    extraReducers: builder => builder
        .addMatcher(authApi.endpoints.loginUser.matchFulfilled, async (state, { payload }) => {
            try {
                await AsyncStorage.setItem('user', JSON.stringify(payload));
            } catch (error) {
                console.error(error);
            }
            state.user = payload;
        })
        .addMatcher(authApi.endpoints.logoutUser.matchFulfilled, async (state) => {
            try {
                await AsyncStorage.removeItem('user');
            } catch (error) {
                console.error(error);
            }
            state.user = null;
        }),
});

export default authSlice;
