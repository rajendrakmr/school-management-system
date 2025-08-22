 
import { apiSlice } from "./apiSlice"; 
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userInfo"; 
import storage from "redux-persist/lib/storage"; 
import Breadcrumbs from "./slice/bredCrumbs";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
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
    getDefaultMiddleware(
      {
      serializableCheck: { 
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }
    ).concat(apiSlice.middleware),
    // getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store); 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
 