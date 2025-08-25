import { apiSlice } from "@/store/apiSlice";

export const streamApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getShiftTimes: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => { 
                let url = `/shifts?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["ShiftTime"],
        }),
        saveShiftTime: builder.mutation<any, any>({
            query: (reqData) => { 
                if (reqData.mst_shift_id) { 
                    return {
                        url: `/shifts/${reqData.mst_shift_id}`,
                        method: "PUT",
                        body: reqData,
                    };
                } else { 
                    return {
                        url: "/shifts",
                        method: "POST",
                        body: reqData,
                    };
                }
            },
            invalidatesTags: ["ShiftTime"],
        }), 
        deleteShiftTime: builder.mutation<any, number>({
            query: (id) => ({
                url: `/shifts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ShiftTime"],
        }),
    }),
});

export const {
    useGetShiftTimesQuery, 
    useDeleteShiftTimeMutation,
    useSaveShiftTimeMutation
} = streamApi;
