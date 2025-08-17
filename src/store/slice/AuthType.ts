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
    }),
});

export const { useAuthLoginMutation } = AuthType;
