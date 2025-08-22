import { apiSlice } from "@/store/apiSlice";

export const roleApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query<any, { limit: number; page: number; filter?: string; name?: string; desc?: string }>({
            query: ({ limit, page, filter, name, desc }) => {
                console.log(name,'name')
                let url = `/roles?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                if (name) url += `&name=${name}`;
                if (desc) url += `&desc=${desc}`;
                return url;
            },
            providesTags: ["Role"],
        }),

        saveRole: builder.mutation<any, any>({
            query: (roleData) => {
                if (roleData.mst_role_id) {
                    // Update
                    return {
                        url: `/roles/${roleData.mst_role_id}`,
                        method: "PUT",
                        body: roleData,
                    };
                } else {
                    // Create
                    return {
                        url: "/roles",
                        method: "POST",
                        body: roleData,
                    };
                }
            },
            invalidatesTags: ["Role"],
        }),
        saveAccessPolicy: builder.mutation<any, number>({
            query: (requestData) => ({
                url: `/roles/assign`,
                method: "POST",
                body: requestData,
            }),
            invalidatesTags: ["Role"],
        }),
        createRole: builder.mutation<any, any>({
            query: (newRole) => ({
                url: "/roles",
                method: "POST",
                body: newRole,
            }),
            invalidatesTags: ["Role"],
        }),
        updateRole: builder.mutation<any, any>({
            query: (updatedRole) => ({
                url: `/roles/${updatedRole.mst_role_id}`,
                method: "PUT",
                body: updatedRole,
            }),
            invalidatesTags: ["Role"],
        }),
        deleteRole: builder.mutation<any, number>({
            query: (roleId) => ({
                url: `/roles/${roleId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Role"],
        }),
    }),
});

export const {
    useGetRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
    useSaveRoleMutation,
    useSaveAccessPolicyMutation

} = roleApi;
