import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../rootReducer/rootReducer";
import { persistStore } from "redux-persist";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});
export const persistor = persistStore(store);
export default store;
