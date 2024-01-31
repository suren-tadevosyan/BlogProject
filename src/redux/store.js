import { configureStore } from "@reduxjs/toolkit";
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
import storage from "redux-persist/lib/storage";
import passwordReducer from "./slices/password";
import userReducer from "./slices/auth";
import themeReducer from "./slices/theme";
import postReducer from "./slices/postSlices";

const authPersistConfig = {
  key: "user",
  storage,
};

const themePersistConfig = {
  key: "theme",
  storage,
};

const countPersistConfig = {
  key: "posts",
  storage,
};

const rootReducer = {
  user: persistReducer(authPersistConfig, userReducer),
  password: passwordReducer,
  posts: persistReducer(countPersistConfig, postReducer),
  theme: persistReducer(themePersistConfig, themeReducer),
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
