import { apiSlice } from "@/store/apiSlice";

export const mediumApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMediums: builder.query<any, { limit: number; page: number; filter?: string }>({
            query: ({ limit, page, filter }) => {
                const skip = (page - 1) * limit;
                let url = `/mediums?limit=${limit}&page=${page}`;
                if (filter) url += `&search=${filter}`;
                return url;
            },
            providesTags: ["Medium"],
        }),
        saveMedium: builder.mutation<any, any>({
            query: (mediumData) => { 
                if (mediumData.mst_medium_id) {
                    // Update
                    return {
                        url: `/mediums/${mediumData.mst_medium_id}`,
                        method: "PUT",
                        body: mediumData,
                    };
                } else {
                    // Create
                    return {
                        url: "/mediums",
                        method: "POST",
                        body: mediumData,
                    };
                }
            },
            invalidatesTags: ["Medium"],
        }), 
        deleteMedium: builder.mutation<any, number>({
            query: (mediumId) => ({
                url: `/mediums/${mediumId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Medium"],
        }),
    }),
});

export const {
    useGetMediumsQuery, 
    useDeleteMediumMutation,
    useSaveMediumMutation
} = mediumApi;
