
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import passwordReducer from "./slices/password";
import userReducer from "./slices/auth";
import themeReducer from "./slices/theme"

const authPersistConfig = {
  key: "user",
  storage,
};

const themePersistConfig = {
  key: "theme",
  storage,
};


const rootReducer = {
  user: persistReducer(authPersistConfig, userReducer),
  password: passwordReducer,
  theme: persistReducer(themePersistConfig, themeReducer),
};

const store = configureStore({
  reducer: rootReducer,
});

const persistor = persistStore(store);

export { store, persistor };
