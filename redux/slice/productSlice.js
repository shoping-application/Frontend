import { createSlice } from "@reduxjs/toolkit";
import { getProduct, updateProduct, createOrder, search } from "../thunk/productThunk";

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    product: [],
    error: null,
    success: false,
    order:null,
    searchedProduct:[],
    searchLoading:false,
  },
  reducers: {
    resetProduct: (state) => {
      state.product = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.success = true;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.product.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.product[index] = action.payload;
        }
      })

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })


      .addCase(search.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchedProduct = action.payload;
        state.success = true;
      })
      .addCase(search.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
        state.success = false;
      })
  },
});

export const { resetProduct } = productSlice.actions;

export default productSlice.reducer;
