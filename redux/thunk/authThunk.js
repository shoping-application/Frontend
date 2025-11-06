import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "api";
import { BASE_URL } from "../../config/appConfig";

import api from "../../config/apiConfig";

const signupUser = createAsyncThunk(
  "user/signup",
  async (values, { rejectWithValue }) => {
    try {
      const res = await api.post(`${BASE_URL}/api/user/signup`, values, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("res", res);

      if (res.status === 201 && res.data.success === true) {
        return res.data.user;
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

const loginUser = createAsyncThunk(
  "user/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const res = await api.post(`${BASE_URL}/api/user/login`, values, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("res", res);

      if (res.status === 200 && res.data.success === true) {
        return res.data;
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

const forgotPassword = createAsyncThunk(
  "user/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `${BASE_URL}/api/user/forgot-password`,
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("res", res);

      if (res.status === 200 && res.data.success === true) {
        return res.data.user;
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

const getUserDetail = createAsyncThunk(
  "user/getUserDetail",
  async (values, { rejectWithValue }) => {
    try {
      const res = await api.get(`${BASE_URL}/api/user/user-detail`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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

const updateUserDetail = createAsyncThunk(
  "user/updateUserDetail",
  async (values, { rejectWithValue }) => {
    try {
      const res = await api.post(`${BASE_URL}/api/user/user-detail`,values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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


const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (values, { rejectWithValue }) => {
    try {
      const res = await api.post(`${BASE_URL}/api/user/reset-password`,values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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


export { signupUser, loginUser, resetPassword, forgotPassword, getUserDetail, updateUserDetail };
