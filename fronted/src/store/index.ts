// import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
// import breadcrumbApi from "./slice/bredCrumbs";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userInfo";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import Breadcrumbs from "./slice/bredCrumbs";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "state", "menu"],
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    breadcrumb: Breadcrumbs,
    user: persistedUserReducer,
     [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
    // getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const store = configureStore({
//     reducer: {
//         breadcrumb: breadcrumbApi,
//         [apiSlice.reducerPath]: apiSlice.reducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware().concat(apiSlice.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
