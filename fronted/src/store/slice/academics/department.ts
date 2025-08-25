import { apiSlice } from "@/store/apiSlice";

export const mediumApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDepts: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                let url = `/departments?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Department"],
        }),
        saveDepartment: builder.mutation<any, any>({
            query: (reqData) => {
                if (reqData.mst_department_id) {
                    // Update
                    return {
                        url: `/departments/${reqData.mst_department_id}`,
                        method: "PUT",
                        body: reqData,
                    };
                } else {
                    // Create
                    return {
                        url: "/departments",
                        method: "POST",
                        body: reqData,
                    };
                }
            },
            invalidatesTags: ["Department"],
        }),
        deleteDepartment: builder.mutation<any, number>({
            query: (id) => ({
                url: `/departments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Department"],
        }),
    }),
});

export const {
    useGetDeptsQuery,
    useDeleteDepartmentMutation,
    useSaveDepartmentMutation
} = mediumApi;
