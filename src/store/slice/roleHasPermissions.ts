import { apiSlice } from "@/store/apiSlice";

export const permissionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHasPermissions: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => { 
                let url = `/roles/has-permissions?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Permission"],
        }),
        saveRoleHasPermission: builder.mutation<any, any>({
            query: (permissionData) => { 
                return {
                    url: "/roles/assign",
                    method: "POST",
                    body: permissionData,
                }; 
            },
            invalidatesTags: ["Permission"],
        }), 
        deletePermission: builder.mutation<any, number>({
            query: (permissionId) => ({
                url: `/permissions/${permissionId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Permission"],
        }),
    }),
});

export const {
    useGetHasPermissionsQuery, 
    useDeletePermissionMutation,
    useSaveRoleHasPermissionMutation,
} = permissionApi;
