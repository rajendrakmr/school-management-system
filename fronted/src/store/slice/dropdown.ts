import { apiSlice } from "@/store/apiSlice";

export const dropdown = apiSlice.injectEndpoints({
    endpoints: (builder) => ({ 
        getModules: builder.query({
            query: () => {
                let url = `/modules/list`; 
                return url;
            },
            providesTags: ["Dropdown"],
        }),
        getPermissionsMenu: builder.query({
            query: () => {
                let url = `/permissions/menu`; 
                return url;
            },
            providesTags: ["Dropdown"],
        }),
         roles: builder.query({
            query: () => {
                let url = `/roles/list`; 
                return url;
            },
            providesTags: ["Dropdown"],
        }),

         
    }),
});

export const {
    useGetModulesQuery,
    useGetPermissionsMenuQuery,   
    useRolesQuery, 
} = dropdown;
