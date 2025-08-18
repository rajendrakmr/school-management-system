import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
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
        localStorage.removeItem("authToken"); // Clear token
        sessionStorage.setItem("sessionExpired", "true"); // Store flag

        window.location.href = "/apps/login"; // Redirect to login page
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth, // ✅ Use the correctly typed function
    tagTypes: ["Users", "Departments", "LeaveType","Permission", "AuthType","Role","Column","Breadcrumb","School","Dropdown","Medium"], // Caching identifiers
    endpoints: () => ({}), // Empty as it will be extended
});
