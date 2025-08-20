import { apiSlice } from "@/store/apiSlice";

export const sectionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSections: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                let url = `/sections?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Section"],
        }),
        saveSection: builder.mutation<any, any>({
            query: (request) => {
                if (request.mst_section_id) {
                    return {
                        url: `/sections/${request.mst_section_id}`,
                        method: "PUT",
                        body: request,
                    };
                } else { 
                    return {
                        url: "/sections",
                        method: "POST",
                        body: request,
                    };
                }
            },
            invalidatesTags: ["Section"],
        }),
        deleteSection: builder.mutation<any, number>({
            query: (reqId) => ({
                url: `/sections/${reqId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Section"],
        }),
    }),
});

export const {
    useGetSectionsQuery,
    useDeleteSectionMutation,
    useSaveSectionMutation
} = sectionApi;
