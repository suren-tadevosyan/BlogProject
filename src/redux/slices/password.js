import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  password: "",
  isUppercasePresent: false,
  isLowercasePresent: false,
  isNumberPresent: false,
  isSpecialCharPresent: false,
};

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    setPassword(state, action) {
      state.password = action.payload;
    },
    validatePassword(state) {

      const password = state.password
      state.isUppercasePresent = /[A-Z]/.test(password);
      state.isLowercasePresent = /[a-z]/.test(password);
      state.isNumberPresent = /\d/.test(password);
      state.isSpecialCharPresent = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    },
  },
 

  
});


export const {setPassword,validatePassword} = passwordSlice.actions
export default passwordSlice.reducer
