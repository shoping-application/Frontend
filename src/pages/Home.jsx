import React from "react";
import { ShoppingCart, Search } from "lucide-react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";

import Farm from "../assets/Farm.png";
import Pantry from "../assets/Pantry.png";
import Snacks from "../assets/snacks.png";
import Premium_Dairy from "../assets/Premium_Dairy.png";
import Apple from "../assets/Apples.jpeg"
import Milk from "../assets/Milk.jpg"
import Chips from "../assets/Chips.jpeg"
import Water from "../assets/Water.jpeg"
import TeaCoffee from "../assets/Tea,coffee.jpg"
import Packaged_Food from "../assets/packaged-food.png"
import Atta_Rice_Oil from "../assets/Atta_Rice_Oil.jpg"
import Dairy_Bread_Eggs from "../assets/Dairy,Bread_Eggs.webp"
import Biscuits_Cookies from "../assets/Biscuits&Cookies.webp"
import Skincare from "../assets/Skincare.jpeg"
import Ice_Creams from "../assets/Ice_Creams.webp"

import Header from "./header/Header";


const categories = [
  { name: "Farm-Fresh Fruits & Veggies", catagory: "fruits & vegetables", img: Farm },
  { name: "Premium Dairy & Cheese", catagory: "Dairy & Cheese", img: Premium_Dairy },
  { name: "Snacks & Drinks", catagory: "Snacks & Drinks", img: Snacks },
  { name: "Pantry Staples", catagory: "Pantry Staples", img: Pantry },
];
const featuredProducts = [
  { name: "Organic Apples", weight: "1kg", price: "53.49", img: Apple },
  { name: "Whole Milk", weight: "1 Gallon", price: "92.99", img: Milk },
  { name: "Potato Chips", weight: "Classic", price: "111.99", img: Chips },
  { name: "Sparkling Water", weight: "Lemon", price: "154.29", img: Water },
];

const shopByCategory = [
  { name: "Tea,Coffee & More", catagory: "tea & coffee", img: TeaCoffee },
  { name: "Packaged Food", catagory: "Packaged Food", img: Packaged_Food },
  { name: "Atta,Rice & Oil", img: Atta_Rice_Oil },
  { name: "Dairy,Bread & Eggs", img: Dairy_Bread_Eggs },
  { name: "Ice Creams", img: Ice_Creams },
  { name: "Biscuits & Cookies", img: Biscuits_Cookies },
  { name: "Skincare", img: Skincare },
];


export default function HomePage() {
  const navigate = useNavigate()

  const handleProduct = (p) => {
    const product = {
      _id: Date.now().toString(), // temporary id
      name: p.name,
      description: p.description || "No description available",
      price: parseFloat(p.price),
      weight: { value: parseFloat(p.weight), unit: p.weight.replace(/[0-9.]/g, "").trim() || "kg" },
      brand: p.brand || "Unknown",
      category: p.category || "Misc",
      images: [{ url: p.img }], // wrap single image into an array
      ratings: { average: 0, count: 0, distribution: {} },
      salesCount: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    navigate("/description", { state: { product } });
  }


  const handleCategory = (product) => {
    navigate("/catagoryProduct", { state: { product } })
  }




  return (
    <div>
      <Header />

      <div className="font-sans bg-green-50 min-h-screen">
        {/* Navbar */}


        {/* Search */}
        <div className="flex justify-center mt-0 pt-5 my-6">
          <input
            type="text"
            placeholder="Search for groceries, products..."
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
                isActive
                  ? "text-green-500 font-bold"
                  : "text-green-700 font-medium"
              }
            >
              View All
            </NavLink>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
            {featuredProducts.map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-3 px-2 rounded-lg shadow-md flex flex-col items-center group"
                onClick={() => handleProduct(p)}
              >
                {/* Image container with overflow-hidden */}
                <div className="w-full h-48 overflow-hidden rounded-md mb-3">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-125"
                  />
                </div>

                <h3 className="font-medium text-gray-800">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.weight}</p>
                <p className="text-lg font-bold text-gray-800">₹ {p.price}</p>
                <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Add to Cart
                </button>
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
