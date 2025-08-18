import { apiSlice } from "@/store/apiSlice";

export const columnApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch columns with optional user_id and type
        getColumns: builder.query<any, { user_id?: number; type?: string }>({
            query: ({ type, user_id }) => {
                let url = `/columns?`;
                if (type) url += `type=${type}&`;
                if (user_id) url += `user_id=${user_id}`;
                return url;
            },
            providesTags: ["Column"],
        }),

        // Save or update a role (if mst_role_id exists, update; else create)
        updateColumn: builder.mutation<any, any>({
            query: (formData) => ({
                url: '/columns',
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Column"],
        }),

        // Delete role
        deleteRole: builder.mutation<any, number>({
            query: (roleId) => ({
                url: `/roles/${roleId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Column"],
        }),
    }),
});

export const {
    useGetColumnsQuery,      // Columns ke liye
    useUpdateColumnMutation,     // Role create/update ke liye
    useDeleteRoleMutation,   // Role delete ke liye
} = columnApi;
