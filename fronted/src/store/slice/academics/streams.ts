import { apiSlice } from "@/store/apiSlice";

export const streamApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStreams: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => { 
                let url = `/streams?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Stream"],
        }),
        saveFormData: builder.mutation<any, any>({
            query: (reqData) => { 
                if (reqData.mst_stream_id) {
                    // Update
                    return {
                        url: `/streams/${reqData.mst_stream_id}`,
                        method: "PUT",
                        body: reqData,
                    };
                } else {
                    // Create
                    return {
                        url: "/streams",
                        method: "POST",
                        body: reqData,
                    };
                }
            },
            invalidatesTags: ["Stream"],
        }), 
        deleteFormData: builder.mutation<any, number>({
            query: (id) => ({
                url: `/streams/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Stream"],
        }),
    }),
});

export const {
    useGetStreamsQuery, 
    useDeleteFormDataMutation,
    useSaveFormDataMutation
} = streamApi;
