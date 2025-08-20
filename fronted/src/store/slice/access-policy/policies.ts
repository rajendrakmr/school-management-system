import { apiSlice } from "@/store/apiSlice";

export const api = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPolicies: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => { 
                let url = `/users/roles/?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Policy"],
        }),
        saveRoleHasPermission: builder.mutation<any, any>({
            query: (permissionData) => {  
                return {
                    url: "/roles/assign",
                    method: "POST",
                    body: permissionData,
                }; 
            },
            invalidatesTags: ["Policy"],
        }), 
        // saveAccessPolicy: builder.mutation<any, number>({
        //     query: (requestData) => ({
        //         url: `/roles/assign`,
        //         method: "POST",
        //         body: requestData,
        //     }),
        //     invalidatesTags: ["Role"],
        // }),
         
        deleteRole: builder.mutation<any, number>({
            query: (roleId) => ({
                url: `/roles/${roleId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Policy"],
        }),
    }),
});

export const {
    useGetPoliciesQuery,  
    useSaveRoleHasPermissionMutation,
} = api;
