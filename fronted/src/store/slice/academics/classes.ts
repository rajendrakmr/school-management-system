import { apiSlice } from "@/store/apiSlice";

export const classApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClassess: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                let url = `/classes?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Class"],
        }),
        saveClass: builder.mutation<any, any>({
            query: (request) => {
                if (request.mst_class_id) {
                    return {
                        url: `/classes/${request.mst_class_id}`,
                        method: "PUT",
                        body: request,
                    };
                } else { 
                    return {
                        url: "/classes",
                        method: "POST",
                        body: request,
                    };
                }
            },
            invalidatesTags: ["Class"],
        }),
        deleteClass: builder.mutation<any, number>({
            query: (reqId) => ({
                url: `/classes/${reqId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Class"],
        }),
    }),
});

export const {
    useGetClassessQuery,
    useDeleteClassMutation,
    useSaveClassMutation
} = classApi;
