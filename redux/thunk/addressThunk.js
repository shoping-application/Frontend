import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../config/appConfig";


const createAddress = createAsyncThunk(
  "address/createAddress",
  async (values, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/address/create-address`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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

const getAddress = createAsyncThunk(
  "address/getAddress",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/address/get-addresses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      

      if (res.status === 200 && res.data.success === true) {
        return res.data.address;
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

const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/address/delete-addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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

const setDefaultAddress = createAsyncThunk(
  "address/setDefaultAddress",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/address/set-default/${id}`,{}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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


const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({id,data}, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/address/update-address/${id}`,data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

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


export { createAddress, getAddress, deleteAddress, setDefaultAddress, updateAddress };
