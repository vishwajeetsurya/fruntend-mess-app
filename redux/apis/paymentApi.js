import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/payment`, credentials: "include" }),
    tagTypes: ["payment"],
    endpoints: (builder) => {
        return {
            getFess: builder.query({
                query: () => {
                    return {
                        url: "/fess",
                        method: "GET"
                    };
                },
                providesTags: ["payment"]
            }),
            makePayment: builder.mutation({
                query: userData => {
                    return {
                        url: "/record",
                        method: "POST",
                        body: userData
                    };
                },
                invalidatesTags: ["payment"]
            }),
            getPaymentHistory: builder.query({
                query: userData => {
                    return {
                        url: "/history",
                        method: "POST",
                        body: userData
                    };
                },
                providesTags: ["payment"]
            })
        };
    }
});

export const { useGetFessQuery, useMakePaymentMutation, useGetPaymentHistoryQuery } = paymentApi;
