import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/apiConfig";
import { BASE_URL } from "../../config/appConfig";



const getProduct = createAsyncThunk(
  "product/getProduct",
  async (catagory, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `${BASE_URL}/api/products/get-product/${catagory}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.status === 200 && res.data.success === true) {
        console.log("res", res?.data?.products);
        return res?.data?.products;
      } else {
        return rejectWithValue("Unexpected response.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Server error, please try again."
      );
    }
  }
);

const createProduct = createAsyncThunk(
  "product/createProduct",
  async (values, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${BASE_URL}/api/products/create-product`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("res", res);
      if (res.status === 200 && res.data.success === true) {
        return res?.data?.user;
      } else {
        return rejectWithValue("Unexpected response.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Server error, please try again."
      );
    }
  }
);

const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, ...values }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${BASE_URL}/api/products/update-product/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("res", res);
      if (res.status === 200 && res.data.success === true) {
        return res?.data?.user;
      } else {
        return rejectWithValue("Unexpected response.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Server error, please try again."
      );
    }
  }
);

const createOrder = createAsyncThunk(
  "product/createOrder",
  async ({ values }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${BASE_URL}/api/products/create-order`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("res", res);
      if (res.status === 200 && res.data.success === true) {
        return res?.data?.order;
      } else {
        return rejectWithValue("Unexpected response.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Server error, please try again."
      );
    }
  }
);

const verifyPayment = createAsyncThunk(
  "product/verifyPayment",
  async (paymentResponse, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${BASE_URL}/api/products/verify-payment`,
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200 && res.data.success === true) {
        return res.data; // return success + message
      } else {
        return rejectWithValue("Payment verification failed.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Server error, please try again."
      );
    }
  }
);

const search = createAsyncThunk(
  "product/search",
  async (value, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `${BASE_URL}/api/products/search?query=${encodeURIComponent(value)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("search", res);

      if (res.status === 200 && res.data.success === true) {
        return res?.data?.products;
      } else {
        return rejectWithValue("Unexpected response.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Server error, please try again."
      );
    }
  }
);

export { getProduct, createProduct, updateProduct, createOrder, verifyPayment, search };
