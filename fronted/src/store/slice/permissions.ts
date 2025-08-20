import { apiSlice } from "@/store/apiSlice";

export const permissionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPermissions: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => { 
                let url = `/permissions?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Permission"],
        }),
        savePermission: builder.mutation<any, any>({
            query: (permissionData) => {
                if (permissionData.mst_permission_id) { 
                    return {
                        url: `/permissions/${permissionData.mst_permission_id}`,
                        method: "PUT",
                        body: permissionData,
                    };
                } else { 
                    return {
                        url: "/permissions",
                        method: "POST",
                        body: permissionData,
                    };
                }
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
    useGetPermissionsQuery, 
    useDeletePermissionMutation,
    useSavePermissionMutation,
} = permissionApi;
