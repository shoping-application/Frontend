import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home"
import ProductDescription from "./pages/ProductDescription"
import './App.css'
import Cart from "./pages/cart/Cart"
import Checkout from "./pages/payment/Checkout"
import Payment from "./pages/payment/Payment"
import Profile from "./pages/profile/Profile"
import HelpSupport from "./pages/helpAndSupport/HelpSupport"
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword"
import AboutUs from "./pages/aboutUs/AboutUs"
import CatagoryProduct from "./pages/catagoryProduct/CatagoryProduct"
import Product from "./pages/Products";

import PropTypes from "prop-types";

import Dashboard from "./admin/Dashboard"
import OrderSuccess from "./pages/payment/OrderSuccess";
import ResetPassword from "./pages/auth/ResetPassword";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {


  const GoogleAuthWrapper = ({ children }) => {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {children}
      </GoogleOAuthProvider>
    );
  };

  GoogleAuthWrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/description" element={<ProductDescription />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/helpAndSupport" element={<HelpSupport />} />
          <Route path="/" element={<GoogleAuthWrapper><Signup /></GoogleAuthWrapper>} />
          <Route path="/login" element={<GoogleAuthWrapper><Login /></GoogleAuthWrapper>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/catagoryProduct" element={<CatagoryProduct />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/product" element={<Product />} />
          <Route path="/reseat-password" element={<ResetPassword />} />

          {/* Admin */}

          <Route path="/Admin-dashboard" element={<Dashboard />} />

        </Routes>
      </Router>

    </>
  )
}

export default App
