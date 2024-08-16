import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const attendanceApi = createApi({
    reducerPath: "attendanceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/attendance`,
        credentials: "include",
    }),
    tagTypes: ['Attendance'],
    endpoints: (builder) => ({
        getAttendance: builder.query({
            query: () => ({
                url: "/get",
                method: "GET",
            }),
            transformResponse: (response) => {
                return response.data || []
            },
            providesTags: ["Attendance"],
        }),
        getPresentCount: builder.query({
            query: attendanceData => ({
                url: "/count",
                method: "GET",
                body: attendanceData,
            }),
            transformResponse: (response) => {
                return response || {};
            },
            invalidatesTags: ['Attendance'],
        }),
        getOutstanding: builder.query({
            query: () => {
                return {
                    url: "/outstanding",
                    method: "GET"
                };
            },
            transformResponse: (response) => {
                return response || {};
            },

            providesTags: ["Attendance"]
        }),

        markAttendance: builder.mutation({
            query: attendanceData => ({
                url: "/mark",
                method: "POST",
                body: attendanceData,
            }),
            invalidatesTags: ['Attendance'],
        }),
        getAttendanceReport: builder.mutation({
            query: attendanceData => ({
                url: "/report",
                method: "POST",
                body: attendanceData,
            }),
            transformResponse: (response) => {
                return response.data || {}
            },
            invalidatesTags: ['Attendance'],
        }),
        updateAttendance: builder.mutation({
            query: ({ _id, attendanceData }) => ({
                url: `/update/${_id}`,
                method: 'PUT',
                body: attendanceData,
            }),
            invalidatesTags: (result, error, { _id }) => [{ type: 'Attendance', id: _id }],
        }),
    }),
});

export const {
    useGetAttendanceQuery,
    useGetAttendanceReportMutation,
    useMarkAttendanceMutation,
    useUpdateAttendanceMutation,
    useGetPresentCountQuery
    , useGetOutstandingQuery
} = attendanceApi;
