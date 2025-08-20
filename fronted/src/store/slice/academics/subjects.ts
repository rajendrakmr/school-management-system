import { apiSlice } from "@/store/apiSlice";

export const SubjectApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubjects: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                let url = `/subjects?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Subject"],
        }),
        saveSubject: builder.mutation<any, FormData & { id?: string }>({
            query: (formData) => {
                const isUpdate = !!formData.get('mst_subject_id'); // or formData.get("id")
                return {
                    url: isUpdate ? `/subjects/${formData.get('mst_subject_id')}` : "/subjects",
                    method: isUpdate ? "PUT" : "POST",
                    body: formData, // send FormData directly
                    // Don't set Content-Type, browser sets it automatically for multipart/form-data
                };
            },
            invalidatesTags: ["Subject"],
        })
        ,
        deleteSubject: builder.mutation<any, number>({
            query: (reqId) => ({
                url: `/subjects/${reqId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Subject"],
        }),
    }),
});

export const {
    useGetSubjectsQuery,
    useDeleteSubjectMutation,
    useSaveSubjectMutation
} = SubjectApi;
