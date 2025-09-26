import { createSlice } from "@reduxjs/toolkit";
import { getAddress,createAddress } from "../thunk/addressThunk";


const addressSlice = createSlice({
  name: "address",
  initialState: {
    loading: false,
    address: [],
    error: false,
    success: false,
  },
  extraReducers: (builder) => {
    builder

      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
        state.success = true;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
        state.success = true;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
  },
});

export default addressSlice.reducer;
