//rootReducer.js file.
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import addressReducer from "../slice/addressSlice"
import productReducer from "../slice/productSlice"
import cartReducer from "../slice/cartSlice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user","address","product","cart"],
};

const rootReducer = combineReducers({
  user: authReducer,
  address:addressReducer,
  product:productReducer,
  cart:cartReducer
});

export default persistReducer(persistConfig, rootReducer);
