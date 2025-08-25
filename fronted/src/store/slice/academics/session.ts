import { apiSlice } from "@/store/apiSlice";

export const sessionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSessions: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                let url = `/sessions?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Session"],
        }),
        saveSession: builder.mutation<any, any>({
            query: (request) => {
                if (request.mst_session_id) {
                    return {
                        url: `/sessions/${request.mst_session_id}`,
                        method: "PUT",
                        body: request,
                    };
                } else { 
                    return {
                        url: "/sessions",
                        method: "POST",
                        body: request,
                    };
                }
            },
            invalidatesTags: ["Session"],
        }),
        deleteSession: builder.mutation<any, number>({
            query: (reqId) => ({
                url: `/sessions/${reqId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Session"],
        }),
    }),
});

export const {
    useGetSessionsQuery,
    useDeleteSessionMutation,
    useSaveSessionMutation
} = sessionApi;
