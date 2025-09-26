import React, { useEffect, useState } from 'react';
import { Card, Checkbox, Slider, Button, Rate, Spin, Row, Col, Typography, Tag } from 'antd';
import { FilterOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Header from './header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from "../../redux/thunk/productThunk";
import { addToCart } from "../../redux/thunk/cartThunk";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

const Product = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const dispatch = useDispatch();

  const { product: products, loading } = useSelector((state) => state.product);

  console.log("products products", products);

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    dietary: [],
    ratings: []
  });

  useEffect(() => {
    dispatch(getProduct());

  }, [dispatch]);


  const categories = [...new Set(products?.map(product => product.category) || [])]
    .filter(category => category) // Remove empty/null categories
    .map(category =>
      category.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );

  // Get unique brands from products
  const brands = [...new Set(products?.map(product => product.brand) || [])]
    .filter(brand => brand); // Remove empty/null brands

  const dietaryPreferences = ['Organic', 'Gluten-Free', 'Vegan'];
  const ratings = [4, 3];

  // Initialize categories with original case for filtering
  const originalCategories = [...new Set(products?.map(product => product.category) || [])]
    .filter(category => category);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };


  // const products = [
  //   {
  //     id: 1,
  //     name: 'Organic Apples',
  //     price: 2.99,
  //     unit: 'lb',
  //     category: 'Fruits & Vegetables',
  //     brand: 'Fresh Farms',
  //     dietary: ['Organic'],
  //     rating: 4.5
  //   },
  //   {
  //     id: 2,
  //     name: 'Bananas',
  //     price: 0.59,
  //     unit: 'lb',
  //     category: 'Fruits & Vegetables',
  //     brand: 'Nature\'s Best',
  //     dietary: [],
  //     rating: 4.2
  //   },
  //   {
  //     id: 3,
  //     name: 'Strawberries',
  //     price: 3.49,
  //     unit: 'lb',
  //     category: 'Fruits & Vegetables',
  //     brand: 'Fresh Farms',
  //     dietary: ['Organic'],
  //     rating: 4.7
  //   },
  //   {
  //     id: 4,
  //     name: 'Grapes',
  //     price: 2.79,
  //     unit: 'lb',
  //     category: 'Fruits & Vegetables',
  //     brand: 'Nature\'s Best',
  //     dietary: [],
  //     rating: 4.0
  //   },
  //   {
  //     id: 5,
  //     name: 'Oranges',
  //     price: 1.29,
  //     unit: 'lb',
  //     category: 'Fruits & Vegetables',
  //     brand: 'Fresh Farms',
  //     dietary: [],
  //     rating: 4.3
  //   },
  //   {
  //     id: 6,
  //     name: 'Mangoes',
  //     price: 1.99,
  //     unit: 'lb',
  //     category: 'Fruits & Vegetables',
  //     brand: 'Nature\'s Best',
  //     dietary: [],
  //     rating: 4.6
  //   },
  //   {
  //     id: 7,
  //     name: 'Watermelon',
  //     price: 4.99,
  //     unit: 'each',
  //     category: 'Fruits & Vegetables',
  //     brand: 'Fresh Farms',
  //     dietary: [],
  //     rating: 4.1
  //   },
  //   {
  //     id: 8,
  //     name: 'Pineapple',
  //     price: 2.49,
  //     unit: 'each',
  //     category: 'Fruits & Vegetables',
  //     brand: 'Nature\'s Best',
  //     dietary: [],
  //     rating: 4.4
  //   }
  // ];

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      dietary: [],
      ratings: []
    });
    setPriceRange([0, 100]);
  };

  const filteredProducts = products?.filter(product => {
    if (!product) return false;

    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // Category filter - compare with original case
    if (filters.categories.length > 0) {
      // Map displayed categories back to original case for comparison
      const originalCategory = originalCategories.find(origCat =>
        origCat.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') === filters.categories[0]
      );

      if (originalCategory && product.category !== originalCategory) {
        return false;
      }
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    // Dietary preferences filter
    if (filters.dietary.length > 0) {
      if (filters.dietary.includes('Organic') && !product.organic) {
        return false;
      }
      // Add other dietary filters as needed
    }

    // Ratings filter
    if (filters.ratings.length > 0 && !filters.ratings.some(rating =>
      product.ratings?.average >= rating
    )) {
      return false;
    }

    return true;
  }) || [];

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


  const handleAddCart = (product, e) => {
    e.stopPropagation(); // Prevent card click event


    const quantity = 1;

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

      })
      .catch((err) => {
        console.error("Add to cart error:", err);
        toast.error(err?.message || "Failed to add item to cart. Please try again.");
      });
  };


  

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <Title level={1} className="!text-green-600 !mb-2">FreshCart</Title>
            <Text className="text-gray-600 text-lg">Fresh groceries delivered to your doorstep</Text>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/5">
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <FilterOutlined className="mr-2" />
                      Filters
                    </span>
                    <Button type="link" onClick={clearAllFilters} className="!p-0 !h-auto">
                      Clear all
                    </Button>
                  </div>
                }
                className="sticky top-4"
              >
                {/* Category Filter */}
                <div className="mb-6">
                  <Title level={5} className="!mb-3">Category</Title>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          checked={filters.categories.includes(category)}
                          onChange={() => handleFilterChange('categories', category)}
                          className="!mr-2"
                        >
                          {category}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <Title level={5} className="!mb-3">Price Range</Title>
                  <Slider
                    range
                    min={0}
                    max={1000}
                    value={priceRange}
                    onChange={handlePriceChange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}+</span>
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <Title level={5} className="!mb-3">Brand</Title>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <div key={brand} className="flex items-center">
                        <Checkbox
                          checked={filters.brands.includes(brand)}
                          onChange={() => handleFilterChange('brands', brand)}
                          className="!mr-2"
                        >
                          {brand}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dietary Preferences Filter */}
                <div className="mb-6">
                  <Title level={5} className="!mb-3">Dietary Preferences</Title>
                  <div className="space-y-2">
                    {dietaryPreferences.map(pref => (
                      <div key={pref} className="flex items-center">
                        <Checkbox
                          checked={filters.dietary.includes(pref)}
                          onChange={() => handleFilterChange('dietary', pref)}
                          className="!mr-2"
                        >
                          {pref}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ratings Filter */}
                <div className="mb-6">
                  <Title level={5} className="!mb-3">Ratings</Title>
                  <div className="space-y-3">
                    {ratings.map(rating => (
                      <div key={rating} className="flex items-center">
                        <Checkbox
                          checked={filters.ratings.includes(rating)}
                          onChange={() => handleFilterChange('ratings', rating)}
                          className="!mr-2"
                        >
                          <Rate
                            disabled
                            defaultValue={rating}
                            className="!text-yellow-400 !text-sm"
                          />
                          <span className="ml-2 text-sm text-gray-600">& Up</span>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:w-4/5">
              <div className="flex justify-between items-center mb-6">
                <Text className="text-gray-600">
                  Showing {filteredProducts.length} of {products?.length || 0} products
                </Text>
                {/* <div className="flex items-center space-x-2">
                  <Text className="text-gray-600">Sort by:</Text>
                  <Button type="default" size="small" onClick={() => setSortBy('price_asc')}>Price: Low to High</Button>
                  <Button type="default" size="small" onClick={() => setSortBy('price_desc')}>Price: High to Low</Button>
                </div> */}
              </div>

              <Row gutter={[24, 24]}>
                {filteredProducts.map(product => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                    <Card
                      hoverable
                      className="h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                      // onClick={() => handleProductDesc(product)}
                      cover={
                        <div className="h-48 overflow-hidden relative bg-gray-100">
                          {product.images && product.images.length > 0 ? (
                            <img
                              alt={product.name}
                              src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                              <span className="text-4xl">
                                {product.name.includes('Apple') && '🍎'}
                                {product.name.includes('Banana') && '🍌'}
                                {product.name.includes('Orange') && '🍊'}
                                {product.name.includes('Guava') && '🥭'}
                                {!['Apple', 'Banana', 'Orange', 'Guava'].some(fruit => product.name.includes(fruit)) && '🍎'}
                              </span>
                            </div>
                          )}
                          {product.organic && (
                            <Tag
                              color="green"
                              className="absolute top-3 left-3 font-bold shadow-sm !border-0"
                            >
                              ORGANIC
                            </Tag>
                          )}
                          {product.salesCount > 50 && (
                            <Tag
                              color="red"
                              className="absolute top-3 right-3 font-bold shadow-sm !border-0"
                            >
                              POPULAR
                            </Tag>
                          )}
                        </div>
                      }
                      bodyStyle={{ padding: '16px' }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          {/* Product Name */}
                          <Title level={5} className="!mb-3 !text-gray-900 !text-base font-semibold">
                            {product.name}
                          </Title>

                          {/* Price and Weight */}
                          <div className="flex justify-between items-center mb-3">
                            <Text strong className="text-green-600 text-lg">
                              ₹{product.price}
                              {product.weight && (
                                <span className="text-gray-500 text-sm ml-1">
                                  /{product.weight.value}
                                  {product.weight.unit === 'kg' ? 'kg' : product.weight.unit}
                                </span>
                              )}
                            </Text>
                            {product.brand && (
                              <Tag color="default" className="!text-xs !bg-gray-100 !border-gray-200">
                                {product.brand}
                              </Tag>
                            )}
                          </div>

                          {/* Stock Status */}
                          <div className="mb-3">
                            {product.status === 'active' ? (
                              <Text type="success" className="text-sm flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                In Stock
                              </Text>
                            ) : (
                              <Text type="danger" className="text-sm flex items-center">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                Out of Stock
                              </Text>
                            )}
                          </div>

                          {/* Rating */}
                          {product.ratings?.average > 0 ? (
                            <div className="flex items-center mt-2">
                              <div className="flex mr-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span
                                    key={star}
                                    className={
                                      star <= Math.floor(product.ratings.average)
                                        ? 'text-yellow-400 text-xs'
                                        : 'text-gray-300 text-xs'
                                    }
                                  >
                                    ⭐
                                  </span>
                                ))}
                              </div>
                              <Text type="secondary" className="text-xs">
                                ({product.ratings.count || 0})
                              </Text>
                            </div>
                          ) : (
                            <Text type="secondary" className="text-xs mt-2">
                              No ratings yet
                            </Text>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <Button
                            type="primary"
                            className="w-full bg-green-600 border-green-600 hover:!bg-green-700 hover:!border-green-700 h-10 font-medium"
                            disabled={product.status !== 'active'}
                            icon={<ShoppingCartOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddCart(product, e);
                            }}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🍎</div>
                  <Title level={4} className="!text-gray-600">
                    No products found matching your filters
                  </Title>
                  <Text className="text-gray-500">
                    Try adjusting your filters to see more results
                  </Text>
                  <Button
                    type="primary"
                    className="mt-4 bg-green-600 border-green-600"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;