import { createSlice } from "@reduxjs/toolkit";
import { signupUser, loginUser,getUserDetail } from "../thunk/authThunk";

const authSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: null,
    error: null,
    success: false,
    login: null,
    accessToken: null,
    rememberMe: false,
    isAuthenticated: null,
    userDetail: null,
  },
  extraReducers: (builder) => {
    builder

      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.isAuthenticated = true;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })


      .addCase(getUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload;
        state.success = true;

      })
      .addCase(getUserDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
  },
});

export default authSlice.reducer;
