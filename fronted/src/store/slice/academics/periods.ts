import { apiSlice } from "@/store/apiSlice";

export const periodApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPeriods: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                let url = `/periods?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Class"],
        }),
        savePeriod: builder.mutation<any, any>({
            query: (request) => {
                if (request.mst_period_id) {
                    return {
                        url: `/periods/${request.mst_period_id}`,
                        method: "PUT",
                        body: request,
                    };
                } else { 
                    return {
                        url: "/periods",
                        method: "POST",
                        body: request,
                    };
                }
            },
            invalidatesTags: ["Period"],
        }),
        deletePeriod: builder.mutation<any, number>({
            query: (reqId) => ({
                url: `/periods/${reqId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Period"],
        }),
    }),
});

export const {
    useGetPeriodsQuery,
    useDeletePeriodMutation,
    useSavePeriodMutation
} = periodApi;
