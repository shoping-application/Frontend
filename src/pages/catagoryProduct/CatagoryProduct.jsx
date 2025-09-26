import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Tag, Button, Spin, InputNumber } from 'antd';
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  StarFilled
} from '@ant-design/icons';
import Header from '../header/Header';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from "../../../redux/thunk/productThunk";
import { resetProduct } from "../../../redux/slice/productSlice";
import { addToCart } from "../../../redux/thunk/cartThunk"; // Import addToCart thunk
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

const CategoryProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { product } = location.state || {};
  const { pathname } = useLocation();

  // State for quantity selection
  const [quantities, setQuantities] = useState({});

  // Get category from product or use a default
  const category = product?.category || product?.catagory;

  // Get products and loading state from Redux store
  const { product: products, loading } = useSelector((state) => state.product);

  console.log("Category:", category);
  console.log("Products from Redux:", products);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (category) {
      dispatch(resetProduct());
      dispatch(getProduct(category));
    }
  }, [dispatch, category]);

  // Initialize quantities when products load
  useEffect(() => {
    if (products && products.length > 0) {
      const initialQuantities = {};
      products.forEach(product => {
        initialQuantities[product._id] = 1; // Default quantity is 1
      });
      setQuantities(initialQuantities);
    }
  }, [products]);

  const handleProductDesc = (product) => {
    navigate("/description", { state: { product } });
  };

  const handleAddCart = (product, e) => {
    e.stopPropagation(); // Prevent card click event


    const quantity = quantities[product._id] || 1;

    if (quantity <= 0) {
      toast.error("Please select a valid quantity");
      return;
    }

    dispatch(addToCart({
      product: product._id,
      quantity: quantity
    }))
      .unwrap()
      .then(() => {
        toast.success(`${quantity} ${product.name} added to cart successfully!`);

        // Optional: Reset quantity to 1 after adding to cart
        setQuantities(prev => ({
          ...prev,
          [product._id]: 1
        }));
      })
      .catch((err) => {
        console.error("Add to cart error:", err);
        toast.error(err?.message || "Failed to add item to cart. Please try again.");
      });
  };


  // Display loading state
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
    <>
      <Header />
      <div className='bg-green-50 min-h-screen'>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <Title level={1} className="!text-green-600 !mb-2">
              {category?.charAt(0).toUpperCase() + category?.slice(1)}
            </Title>
            <Text className="text-gray-600 text-lg">
              Discover our selection of fresh and delicious {category}
            </Text>
          </div>

          {/* Products Grid */}
          {products && products.length > 0 ? (
            <Row gutter={[24, 24]}>
              {products.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                  <Card
                    hoverable
                    className="h-full flex flex-col transition-all duration-300 hover:shadow-lg"
                    onClick={() => handleProductDesc(product)}
                    cover={
                      <div className="h-48 overflow-hidden relative">
                        {product.images && product.images.length > 0 ? (
                          <img
                            alt={product.name}
                            src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <ShoppingOutlined className="text-2xl text-gray-400" />
                          </div>
                        )}
                        {product.organic && (
                          <Tag
                            color="green"
                            className="absolute top-3 left-3 font-bold shadow-md"
                          >
                            ORGANIC
                          </Tag>
                        )}
                        {product.salesCount > 100 && (
                          <Tag
                            color="red"
                            className="absolute top-3 right-3 font-bold shadow-md"
                          >
                            POPULAR
                          </Tag>
                        )}
                      </div>
                    }
                    actions={[
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        className="!flex-1 bg-green-600 border-green-600 hover:!bg-green-700 hover:!border-green-700 transition-colors w-full text-lg !p-5"
                        onClick={(e) => handleAddCart(product, e)}
                        loading={loading}
                      >
                        Add to cart
                      </Button>
                    ]}
                    styles={{
                      body: { padding: '16px' },
                      actions: {
                        padding: '10x',
                        margin: 0,
                        gap: '8px'
                      }
                    }}
                  >
                    {/* Card content remains the same */}
                    <div className="flex-1">
                      <Title level={5} className="!mb-2 line-clamp-1 hover:text-green-600 transition-colors">
                        {product.name}
                      </Title>

                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <StarFilled
                              key={star}
                              className={
                                star <= Math.floor(product.ratings?.average || 0)
                                  ? 'text-yellow-400 text-sm'
                                  : 'text-gray-300 text-sm'
                              }
                            />
                          ))}
                        </div>
                        <Text type="secondary" className="text-xs">
                          ({product.ratings?.count || 0})
                        </Text>
                      </div>

                      {/* Price and Weight */}
                      <div className="flex justify-between items-center mb-2">
                        <Text strong className="text-green-600 text-lg">
                          ₹{product.price}
                          {product.weight && (
                            <span className="text-sm text-gray-500 ml-1">
                              /{product.weight.value}{product.weight.unit}
                            </span>
                          )}
                        </Text>
                        {product.brand && (
                          <Tag color="blue" className="text-xs">
                            {product.brand}
                          </Tag>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mb-2">
                        {product.status === 'active' ? (
                          <Text type="success" className="text-xs">
                            ✓ In Stock
                          </Text>
                        ) : (
                          <Text type="danger" className="text-xs">
                            ✗ Out of Stock
                          </Text>
                        )}
                      </div>

                      {/* Description preview */}
                      <Text className="text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl shadow-sm border border-green-200">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <ShoppingOutlined className="text-4xl text-green-600" />
              </div>
              <Title level={3} className="!text-green-700 mb-2">
                No products found in {category}
              </Title>
              <Text className="text-green-600 text-base">
                Check back later for fresh arrivals 🌱
              </Text>
              <Button
                type="primary"
                className="mt-4 bg-green-600 py-5 border-green-600 hover:!bg-green-700"
                onClick={() => navigate('/home')}
              >
                Back to Home
              </Button>
            </div>
          )}

          {/* Additional Info Section */}
          <div className="bg-white p-6 rounded-lg mt-10 border border-green-200 shadow-sm">
            <Title level={4} className="text-green-800 text-center mb-6">
              Why Choose Our Products?
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <div className="text-2xl text-green-600 mb-2">🚚</div>
                  <Text strong className="block mb-1">Fast Delivery</Text>
                  <p className="text-gray-600 text-sm">Fresh products delivered to your door in minutes</p>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <div className="text-2xl text-green-600 mb-2">🌱</div>
                  <Text strong className="block mb-1">Quality Guarantee</Text>
                  <p className="text-gray-600 text-sm">We source only the freshest, highest quality products</p>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="text-center">
                  <div className="text-2xl text-green-600 mb-2">💰</div>
                  <Text strong className="block mb-1">Best Prices</Text>
                  <p className="text-gray-600 text-sm">Competitive prices without compromising on quality</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProduct;