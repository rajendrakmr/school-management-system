import { apiSlice } from "@/store/apiSlice";

export const commonApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getList: builder.query<any, { url: string; limit?: number; page?: number; filter?: Record<string, any> }>({
            query: ({ url, limit = 10, page = 1, filter = {} }) => {
                const params = new URLSearchParams();
                params.append("limit", limit.toString());
                params.append("page", page.toString());
                Object.entries(filter).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== "") {
                        params.append(key, String(value));
                    }
                });
                return `${url}?${params.toString()}`;
            },
        }),


        saveItem: builder.mutation<any, { url: string; body: any; idField?: string }>({
            query: ({ url, body, idField = "id" }) => {
                if (body[idField]) {
                    return {
                        url: `${url}/${body[idField]}`,
                        method: "PUT",
                        body,
                    };
                }
                return {
                    url,
                    method: "POST",
                    body,
                };
            },
        }),

        deleteItem: builder.mutation<any, { url: string; id: number | string }>({
            query: ({ url, id }) => ({
                url: `${url}/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetListQuery,
    useSaveItemMutation,
    useDeleteItemMutation,
} = commonApi;
