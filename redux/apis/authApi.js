import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user`,
        credentials: "include"
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: [{ type: "User", id: "LIST" }],
        }),
        loginUser: builder.mutation({
            query: (loginData) => ({
                url: "/login",
                method: "POST",
                body: loginData,
            }),

        }),
        updateUserProfile: builder.mutation({
            query: ({ id, userData }) => ({
                url: `/update-profile/${id}`,
                method: "PUT",
                body: userData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
        }),
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: "/forgot-password",
                method: "POST",
                body: { email },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ email, otp, newPassword }) => ({
                url: "/reset-password",
                method: "PUT",
                body: { email, otp, newPassword },
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useUpdateUserProfileMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogoutUserMutation,
} = authApi;
