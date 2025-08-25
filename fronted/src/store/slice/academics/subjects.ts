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
         saveSubject: builder.mutation<any, any>({
            query: (reqData) => { 
                if (reqData.mst_subject_id) { 
                    return {
                        url: `/subjects/${reqData.mst_subject_id}`,
                        method: "PUT",
                        body: reqData,
                    };
                } else { 
                    return {
                        url: "/subjects",
                        method: "POST",
                        body: reqData,
                    };
                }
            },
            invalidatesTags: ["Subject"],
        }),  
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
