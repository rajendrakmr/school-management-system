import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";

const apiUrl = process.env.REACT_APP_API_URL;
const baseUrl = apiUrl;

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: "include", // 👈 important for cookies
});

// ✅ Wrapper with refresh logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // 👉 If access token expired
  if (result.error?.status === 401) {
    console.warn("Access token expired, trying refresh...");

    // Call refresh endpoint
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      console.log("✅ Token refreshed, retrying original request...");
      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.error("❌ Refresh failed, logging out...");
      api.dispatch({ type: "auth/logout" });
      window.location.href = "/apps/login";
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Session",
    "ClassSubject",
    "Period",
    "Grade",
    "Department",
    "Stream",
    "Departments",
    "LeaveType",
    "Permission",
    "AuthType",
    "Role",
    "Column",
    "Breadcrumb",
    "ShiftTime",
    "School",
    "Policy",
    "Dropdown",
    "Medium",
    "Section",
    "Subject",
    "Semester",
    "Class",
  ],
  endpoints: () => ({}),
});
