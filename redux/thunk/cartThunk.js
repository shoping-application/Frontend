import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/apiConfig";

import { BASE_URL } from "../../config/appConfig";


export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({  product, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${BASE_URL}/api/userCart/add-to-cart`,
        { product, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);


export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE_URL}/api/userCart/get-cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("res res",res.data?.data);
      
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);


export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.put(
        `${BASE_URL}/api/userCart/${id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);


export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE_URL}/api/userCart/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return id; // return the deleted item id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);


export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE_URL}/api/userCart/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);


export const getAllOrders = createAsyncThunk(
  "cart/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE_URL}/api/userCart/get-all-order`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("res res",res.data?.data);
      
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);


export const getAllAdminOrders = createAsyncThunk(
  "cart/getAllAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE_URL}/api/userCart/get-all-order-in-admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("res res",res.data?.data);
      
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "cart/updateOrderStatus",
  async ({orderId,status}, { rejectWithValue }) => {
    try {
      const res = await api.put(`${BASE_URL}/api/userCart/update-status/${orderId}`,{ status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("res res",res.data?.data);
      
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Server error");
    }
  }
);