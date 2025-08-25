import { apiSlice } from "@/store/apiSlice";

export const classApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClassSubjects: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                let url = `/class-subjects?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["ClassSubject"],
        }),
        saveClassSubject: builder.mutation<any, any>({
            query: (request) => {
                if (request.mst_class_subject_id) {
                    return {
                        url: `/class-subjects/${request.mst_class_subject_id}`,
                        method: "PUT",
                        body: request,
                    };
                } else { 
                    return {
                        url: "/class-subjects",
                        method: "POST",
                        body: request,
                    };
                }
            },
            invalidatesTags: ["ClassSubject"],
        }),
        deleteClassSubject: builder.mutation<any, number>({
            query: (reqId) => ({
                url: `/class-subjects/${reqId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ClassSubject"],
        }),
    }),
});

export const {
    useGetClassSubjectsQuery,
    useDeleteClassSubjectMutation,
    useSaveClassSubjectMutation
} = classApi;
