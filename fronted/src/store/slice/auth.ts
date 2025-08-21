import { apiSlice } from "@/store/apiSlice";

export const AuthType = apiSlice.injectEndpoints({
    endpoints: (builder) => ({ 
        authLogin: builder.mutation<any, { email: string; password: string }>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["AuthType"],  
        }),

        // 👇 new logout endpoint
        authLogout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),
    }),
});

export const { useAuthLoginMutation, useAuthLogoutMutation } = AuthType;
