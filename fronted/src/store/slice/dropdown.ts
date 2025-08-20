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
            providesTags: ["Role"],
        }),
        mediums: builder.query({
            query: () => {
                let url = `/mediums/list`;
                return url;
            },
            providesTags: ["Dropdown"],
        }),
         getUsers: builder.query({
            query: ({ page, limit, search }) => {
                let url = `/users/list?page=${page}&limit=${limit}`;
                if (search) url += `&search=${search}`;
                return url;
            },
            providesTags: ["Dropdown"],
        }),

        //  getUsers: builder.query<
        //     { users: { value: string; label: string }[]; total: number; page: number; totalPages: number },
        //     { page: number; limit: number; search?: string }
        // >({
        //     query: ({ page, limit, search }) => {
        //         let url = `/users/list?page=${page}&limit=${limit}`;
        //         if (search) url += `&search=${search}`;
        //         return url;
        //     },
        //     providesTags: ["Dropdown"],
        // }),


    }),
});

export const {
    useGetModulesQuery,
    useGetPermissionsMenuQuery,
    useRolesQuery,
    useMediumsQuery,
      useGetUsersQuery,
} = dropdown;
