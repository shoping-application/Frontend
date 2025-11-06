import React, { useEffect, useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Spin, Button, Input } from 'antd';

import Farm from "../assets/Farm.png";
import Pantry from "../assets/Pantry.png";
import Snacks from "../assets/Snacks.png";
import Premium_Dairy from "../assets/Premium_Dairy.png";

import TeaCoffee from "../assets/Tea,Coffee.jpg"
import Packaged_Food from "../assets/packaged-food.png"
import Atta_Rice_Oil from "../assets/Atta_Rice_Oil.jpg"
import Dairy_Bread_Eggs from "../assets/Dairy,Bread_Eggs.webp"
import Biscuits_Cookies from "../assets/Biscuits&Cookies.webp"
import Skincare from "../assets/Skincare.jpeg"
import Ice_Creams from "../assets/Ice_Creams.webp"
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from "../../redux/thunk/productThunk";

import { addToCart } from "../../redux/thunk/cartThunk"

import Header from "./header/Header";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  ShoppingCartOutlined,
  ShareAltOutlined
} from '@ant-design/icons';


const categories = [
  { name: "Farm-Fresh Fruits & Veggies", catagory: "fruits & vegetables", img: Farm },
  { name: "Premium Dairy & Cheese", catagory: "Dairy & Cheese", img: Premium_Dairy },
  { name: "Snacks & Drinks", catagory: "Snacks & Drinks", img: Snacks },
  { name: "Pantry Staples", catagory: "Pantry Staples", img: Pantry },
];


const shopByCategory = [
  { name: "Tea,Coffee & More", catagory: "tea & coffee", img: TeaCoffee },
  { name: "Packaged Food", catagory: "Packaged Food", img: Packaged_Food },
  { name: "Atta,Rice & Oil", catagory: "Atta,Rice & Oil", img: Atta_Rice_Oil },
  { name: "Dairy,Bread & Eggs", catagory: "Dairy,Bread & Eggs", img: Dairy_Bread_Eggs },
  { name: "Ice Creams", catagory: "Ice Creams", img: Ice_Creams },
  { name: "Biscuits & Cookies", catagory: "Biscuits & Cookies", img: Biscuits_Cookies },
  { name: "Skincare", catagory: "Skincare", img: Skincare },
];



export default function HomePage() {
  const location = useLocation();
  const [query, setQuery] = useState("");

  //searchedProduct

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { product: featuredProducts, loading } = useSelector((state) => state.product);

  const { searchedProduct } = useSelector((state) => state.product);

  console.log("searchedProduct", searchedProduct);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    dispatch(getProduct());

  }, [dispatch]);

  const handleCategory = (product) => {
    navigate("/catagoryProduct", { state: { product } })
  }

  const handleProductDesc = (product) => {
    navigate("/description", { state: { product } });
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product: product._id,
      quantity: 1, // or any selected quantity
    }))
      .unwrap()
      .then(() => {
        toast.success(`${product.name} added to cart`);
      })
      .catch((err) => {
        toast.error(err || "Failed to add to cart");
      });
  };

  const shareProduct = (product) => {
    const productUrl = `${window.location.origin}/product/${product._id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: productUrl,
      }).catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(productUrl);
      toast.success("Product link copied to clipboard!");
    }
  };




  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Redirect to /product when typing starts
    if (value.trim()) {
      navigate("/product", { state: { query: value } }); // pass query to product page
    }
  };



  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-green-50 min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      </>
    );
  }

  return (
    <div>
      <Header />

      <div className="font-sans bg-green-50 min-h-screen">
        {/* Navbar */}


        {/* Search */}
        <div className="flex justify-center mt-0 pt-5 my-6">
          <Input
            type="text"
            placeholder="Search for groceries, products..."
            value={query}
            onChange={handleSearch}
            className="w-2/3 md:w-1/2 border rounded-full px-5 py-3 shadow-sm focus:outline-green-500"
          />
        </div>

        {/* Top Categories */}
        <div className="px-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group"
                onClick={() => handleCategory(cat)}
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-56 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-125"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="px-6 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Featured Products</h2>
            <NavLink
              to="/product"
              className={({ isActive }) =>
                // isActive
                // ? " font-bold"
                // : "hover:text-green-500 font-medium text-underline"

                `text-green-600 transition-colors duration-200 ${isActive
                  ? "font-bold underline underline-offset-4"
                  : "font-medium hover:text-green-800 hover:underline"
                }`
              }
            >
              View All
            </NavLink>
          </div>



          <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-4">
            {featuredProducts.slice(0, 5).map((p, idx) => (
              <div
                key={p._id || idx}
                className="bg-white p-3 rounded-xl shadow-md flex flex-col items-center group hover:shadow-lg transition-all cursor-pointer"
              >
                {/* Clickable image & product info */}
                <div
                  onClick={() => handleProductDesc(p)}
                  className="w-full text-center"
                >
                  <div className="w-full h-48 overflow-hidden rounded-md mb-3">
                    <img
                      src={p.images?.[0]?.url || p.img}
                      alt={p.name}
                      className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>

                  <h3 className="font-semibold text-gray-800 group-hover:text-green-700">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {p.weight?.value} {p.weight?.unit}
                  </p>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    ₹ {p.price}
                  </p>
                </div>

  

                <div className="flex items-center justify-between mt-3 w-full space-x-2">
                  {/* Add to Cart Button */}
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(p)}
                    // CHANGE 1: Use 'flex-grow' and 'min-w-0' for flexible scaling.
                    className="flex-grow min-w-24 h-10 text-sm font-semibold bg-green-600 hover:!bg-green-700 border-none"
                  >
                    Add to Cart
                  </Button>

                  <Button
                    icon={
                      <ShareAltOutlined className="text-gray-500 group-hover:text-green-600 transition-colors" />
                    }
                    onClick={() => shareProduct(p)}
                    size="middle"
                    className="h-10 w-10 flex-shrink-0 flex items-center justify-center border-gray-300 hover:!border-green-600 rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>



        </div>

        {/* Shop by Category */}
        <div className="px-6 pb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-4 ">
            {shopByCategory.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white p-3 px-2 rounded-lg shadow-md flex flex-col items-center cursor-pointer group"
                onClick={() => handleCategory(cat)}
              >
                <div className="w-full h-24 overflow-hidden rounded-md mb-2">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-125"
                  />
                </div>
                <p className="text-gray-700 font-medium text-sm">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
