import { apiSlice } from "@/store/apiSlice";

export const GradeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getGrades: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                let url = `/grades?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Class"],
        }),
        saveGrade: builder.mutation<any, any>({
            query: (request) => {
                if (request.mst_grade_id) {
                    return {
                        url: `/grades/${request.mst_grade_id}`,
                        method: "PUT",
                        body: request,
                    };
                } else { 
                    return {
                        url: "/grades",
                        method: "POST",
                        body: request,
                    };
                }
            },
            invalidatesTags: ["Grade"],
        }),
        deleteGrade: builder.mutation<any, number>({
            query: (reqId) => ({
                url: `/grades/${reqId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Grade"],
        }),
    }),
});

export const {
    useGetGradesQuery,
    useDeleteGradeMutation,
    useSaveGradeMutation
} = GradeApi;
