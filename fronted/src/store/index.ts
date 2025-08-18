import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import breadcrumbApi from "./slice/bredCrumbs";


export const store = configureStore({
    reducer: {
        breadcrumb: breadcrumbApi,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
