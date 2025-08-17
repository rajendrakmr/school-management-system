import { apiSlice } from "@/store/apiSlice";

export const leaveTypeApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLeaveTypes: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                const skip = (page - 1) * limit;
                let url = `/leaveTypes?limit=${limit}&skip=${skip}`; 
                if (filter) { url += `&search=${filter}`;  } 
                return url;
            },
            providesTags: ["LeaveType"],
        }), 
        createLeaveType: builder.mutation<any, any>({
            query: (newLeaveType) => ({
                url: "/leaveTypes",
                method: "POST",
                body: newLeaveType,
            }),
            invalidatesTags: ["LeaveType"],  
        }),
        updateLeaveType: builder.mutation<any, any>({
            query: (newLeaveType) => ({
                url: "/leaveTypes",
                method: "PUT",
                body: newLeaveType,
            }),
            invalidatesTags: ["LeaveType"],  
        }),
    }),
});

export const { useGetLeaveTypesQuery ,useCreateLeaveTypeMutation ,useUpdateLeaveTypeMutation} = leaveTypeApi;
