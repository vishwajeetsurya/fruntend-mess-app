import { configureStore } from "@reduxjs/toolkit";
import { attendanceApi } from "./apis/attendanceApi";
import { authApi } from "./apis/authApi";
import { paymentApi } from "./apis/paymentApi";
// import authSlice from "./slice/authSlice";

const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [attendanceApi.reducerPath]: attendanceApi.reducer,
        // auth: authSlice
    },
    middleware: (getDefaultMiddleware) =>
        [...getDefaultMiddleware(),
        authApi.middleware,
        attendanceApi.middleware,
        paymentApi.middleware
        ]
});

export default reduxStore;
