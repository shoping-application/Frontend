import { createSlice } from "@reduxjs/toolkit";
import {getUserCart ,updateCartItem , getAllOrders, getAllAdminOrders} from "../thunk/cartThunk";

const productSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    products: [],
    error: null,
    success: false,
    orders:[],
    adminOrders:[]
  },
  reducers: {

    updateQuantityOptimistic: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.products.find(item => item._id === cartItemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    // Optimistic remove
    removeItemOptimistic: (state, action) => {
      const cartItemId = action.payload;
      state.products = state.products.filter(item => item._id !== cartItemId);
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.success = true;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const index = state.products.findIndex(item => item._id === updatedItem._id);
        if (index !== -1) {
          state.products[index] = updatedItem;
        }
      })

      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.success = true;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getAllAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload;
        state.success = true;
      })
      .addCase(getAllAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
  },
});

export const { updateQuantityOptimistic, removeItemOptimistic } = productSlice.actions;

export default productSlice.reducer;
