import { apiSlice } from "@/store/apiSlice";

export const SemesterApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSemesters: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                let url = `/semesters?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Semester"],
        }),
        saveSemester: builder.mutation<any, any>({
            query: (request) => {
                if (request.mst_semester_id) {
                    return {
                        url: `/semesters/${request.mst_semester_id}`,
                        method: "PUT",
                        body: request,
                    };
                } else { 
                    return {
                        url: "/semesters",
                        method: "POST",
                        body: request,
                    };
                }
            },
            invalidatesTags: ["Semester"],
        }),
        deleteSemester: builder.mutation<any, number>({
            query: (reqId) => ({
                url: `/semesters/${reqId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Semester"],
        }),
    }),
});

export const {
    useGetSemestersQuery,
    useDeleteSemesterMutation,
    useSaveSemesterMutation
} = SemesterApi;
