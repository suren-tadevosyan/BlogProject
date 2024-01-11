// import { configureStore } from "@reduxjs/toolkit";
// import passwordReducer from "./slices/password";
// import userReducer from "./slices/auth";

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//     password: passwordReducer,
//   },
// });

// export default store;
// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import passwordReducer from "./slices/password";
import userReducer from "./slices/auth";

const authPersistConfig = {
  key: "user",
  storage,
};

const rootReducer = {
  user: persistReducer(authPersistConfig, userReducer),
  password: passwordReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

const persistor = persistStore(store);

export { store, persistor };
