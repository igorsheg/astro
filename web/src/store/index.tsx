import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { servicesApiSlice } from "../services/api";

const rootReducer = combineReducers({
  [servicesApiSlice.reducerPath]: servicesApiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(servicesApiSlice.middleware),
});

export default store;
