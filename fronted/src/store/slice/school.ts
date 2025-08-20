import { apiSlice } from "@/store/apiSlice";

export const schoolApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch schools with pagination and optional filter
        getSchools: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                const skip = (page - 1) * limit;
                let url = `/schools?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["School"],
        }),

        // Save school: Create or Update
        saveSchool: builder.mutation<any, any>({
            query: (schoolData) => { 
                if (schoolData instanceof FormData) {
                    return {
                        url: schoolData.get("id") ? `/schools/${schoolData.get("id")}` : "/schools",
                        method: schoolData.get("id") ? "PUT" : "POST",
                        body: schoolData,
                        headers: {},
                    };
                } else {
                    return {
                        url: schoolData.id ? `/schools/${schoolData.id}` : "/schools",
                        method: schoolData.id ? "PUT" : "POST",
                        body: schoolData,
                        headers: { "Content-Type": "application/json" },
                    };
                }
            },
            invalidatesTags: ["School"],
        }),
        updateSchool: builder.mutation<any, { id?: string; schoolData: FormData }>({
            query: ({ id, schoolData }) => ({
                url: id ? `/schools/${id}` : "/schools",
                method: id ? "PUT" : "POST",
                body: schoolData,
                headers: {},
            }),
            invalidatesTags: ["School"],
        }),


        // Delete school
        deleteSchool: builder.mutation<any, number>({
            query: (schoolId) => ({
                url: `/schools/${schoolId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["School"],
        }),
    }),
});

export const {
    useGetSchoolsQuery,
    useDeleteSchoolMutation,
    useSaveSchoolMutation,
    useUpdateSchoolMutation,
} = schoolApi;
