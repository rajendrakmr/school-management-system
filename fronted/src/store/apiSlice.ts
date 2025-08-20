import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";

const baseUrl = "http://localhost:5000/api/v1";

const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include", // 👈 important for cookies
});

// ✅ Correctly typed wrapper function for handling 401 errors
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,   // Request type (string URL or FetchArgs object)
    unknown,              // Response type (unknown since it varies)
    FetchBaseQueryError,  // Error type
    {},                   // Additional arguments (empty object)
    FetchBaseQueryMeta    // Metadata (for debugging)
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        console.error("Session expired. Redirecting to login..."); 
        api.dispatch({ type: "auth/logout" });  
        window.location.href = "/apps/login";
    } 
    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "Users", "Departments", "LeaveType", "Permission",
        "AuthType", "Role", "Column", "Breadcrumb",
        "School", "Policy","Dropdown", "Medium","Section","Subject","Semester"
    ],
    endpoints: () => ({}),
});
