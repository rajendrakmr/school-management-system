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
            query: (roleId?: string) => {
                let url = `/permissions/lists`;
                if (roleId) {
                    url += `?role_id=${roleId}`;
                }
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
        getMediumList: builder.query({
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
        getSectionList: builder.query({
            query: (session_id?: string | number) => {
                let url = `/sections/list`;
                if (session_id) url += `?session_id=${session_id}`;
                return url;
            },
            providesTags: ["Section"],
        }),
        getShiftList: builder.query({
            query: (session_id?: string | number) => {
                let url = `/shifts/list`;
                if (session_id) url += `?session_id=${session_id}`;
                return url;
            },
            providesTags: ["ShiftTime"],
        }),
        getStreamList: builder.query({
            query: () => {
                let url = `/streams/list`;
                return url;
            },
            providesTags: ["Stream"],
        }),
        getBracnhList: builder.query({
            query: () => {
                let url = `/schools/list`;
                return url;
            },
            providesTags: ["School"],
        }),
        getDepartmentList: builder.query({
            query: (branch_id?: string | number) => {
                let url = `/departments/list`;
                if (branch_id) url += `?branch_id=${branch_id}`;
                return url;
            },
            providesTags: ["Department"],
        }),
        getSessionList: builder.query({
            query: (branch_id?: string | number) => {
                let url = `/sessions/list?`;
                if (branch_id) url += `&branch_id=${branch_id}`; 
                return url;
            }, 
            providesTags: ["Session"],
        }),

        getClassList: builder.query({
            query: (session_id?: string | number) => {
                let url = `/classes/list`;
                if (session_id) url += `?session_id=${session_id}`;
                return url;
            },
            providesTags: ["Class"],
        }),
        // getClassList: builder.query({
        //     query: () => {
        //         let url = `/sessions/list`;
        //         return url;
        //     },
        //     providesTags: ["Session"],
        // }),
        
        getSubjectList: builder.query({ 
             query: (branch_id?: string | number) => {
                let url = `/subjects/list`;
                if (branch_id) url += `?branch_id=${branch_id}`;
                return url;
            },
            providesTags: ["Subject"],
        }),
        getPlanList: builder.query({ 
             query: () => {
                let url = `/plans/list`; 
                return url;
            }, 
        }),




    }),
});

export const {
    useGetModulesQuery,
    useGetPermissionsMenuQuery,
    useRolesQuery,
    useGetStreamListQuery,
    useGetSectionListQuery,
    useGetUsersQuery,
    useGetMediumListQuery,
    useGetShiftListQuery,
    useGetBracnhListQuery,
    useGetDepartmentListQuery,
    useGetSessionListQuery,
    useGetClassListQuery,
    useGetSubjectListQuery,
    useGetPlanListQuery
} = dropdown;
