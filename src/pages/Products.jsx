import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Card, Checkbox, Slider, Button, Input, Rate, Spin, Row, Col, Typography, Tag } from 'antd';
import { FilterOutlined, RightOutlined, CloseOutlined, ShoppingCartOutlined, ShareAltOutlined, StarFilled } from '@ant-design/icons';
import Header from './header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, search } from "../../redux/thunk/productThunk";
import { addToCart } from "../../redux/thunk/cartThunk";
import { useNavigate, useLocation } from "react-router-dom";
import debounce from "lodash.debounce";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

const Product = () => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const location = useLocation();
  const initialQuery = location.state?.query || "";

  const [query, setQuery] = useState(initialQuery);
  const searchInputRef = useRef(null);

  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);

  const toggleFilters = () => {
    setIsMobileFilterVisible(prev => !prev);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { product: products, loading } = useSelector((state) => state.product);
  const { searchedProduct } = useSelector((state) => state.product);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (query) {
      dispatch(search(query));
    }
  }, [dispatch, query]);

  // Auto-focus search input when initialQuery has value
  useEffect(() => {
    if (initialQuery && searchInputRef.current) {
      searchInputRef.current.focus();
      // Set cursor at the end of the text
      const input = searchInputRef.current.input;
      if (input) {
        const length = input.value?.length;
        input.setSelectionRange(length, length);
      }
    }
  }, [initialQuery]);



  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    dietary: [],
    ratings: []
  });

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  // Get categories and brands from searchedProduct if available, otherwise from products
  const getFilterData = () => {
    // const sourceData = searchedProduct?.length > 0 ? searchedProduct : products;

    const sourceData = query ? searchedProduct : products;

    const categories = [...new Set(sourceData?.map(product => product.category) || [])]
      .filter(category => category)
      .map(category =>
        category.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );

    const brands = [...new Set(sourceData?.map(product => product.brand) || [])]
      .filter(brand => brand);

    // Initialize categories with original case for filtering
    const originalCategories = [...new Set(sourceData?.map(product => product.category) || [])]
      .filter(category => category);

    return { categories, brands, originalCategories };
  };

  const { categories, brands, originalCategories } = getFilterData();

  const dietaryPreferences = ['Organic', 'Gluten-Free', 'Vegan'];
  const ratings = [4, 3];

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

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      dietary: [],
      ratings: []
    });
    setPriceRange([0, 1000]);
  };

  // Filter logic for both searched products and regular products
  const getFilteredProducts = () => {
    // const sourceData =( query && searchedProduct?.length > 0) ? searchedProduct : products;

    const sourceData = query ? searchedProduct : products;

    return sourceData?.filter(product => {
      if (!product) return false;

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Category filter - compare with original case
      if (filters.categories?.length > 0) {
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
      if (filters?.brands?.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Dietary preferences filter
      if (filters?.dietary?.length > 0) {
        if (filters.dietary.includes('Organic') && !product.organic) {
          return false;
        }
        // Add other dietary filters as needed
      }

      // Ratings filter
      if (filters?.ratings?.length > 0 && !filters.ratings.some(rating =>
        product.ratings?.average >= rating
      )) {
        return false;
      }

      return true;
    }) || [];
  };

  const filteredProducts = getFilteredProducts();

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

  const handleProductDesc = (product) => {
    navigate("/description", { state: { product } });
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((val) => {
        dispatch(search(val));
      }, 400),
    [dispatch]
  );

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);

      // Always call debounce even if empty (so search results update)
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Clear filters when search results change
  useEffect(() => {
    if (searchedProduct?.length > 0) {
      setFilters({
        categories: [],
        brands: [],
        dietary: [],
        ratings: []
      });
    }
  }, [searchedProduct]);

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

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-8">

            <div className="sm:hidden flex justify-end mb-4">
              <Button
                type="default"
                icon={isMobileFilterVisible ? <CloseOutlined /> : <FilterOutlined />}
                onClick={toggleFilters}
                className="!bg-green-100 !border-green-300 !text-green-700"
              >
                {isMobileFilterVisible ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
            {/* Filters Sidebar */}
            <div className= {`
        ${isMobileFilterVisible ? 'block' : 'hidden'} 
        sm:block
        w-full sm:w-1/3 md:w-1/4 lg:w-1/5
      `}>
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <FilterOutlined className="mr-2" />
                      Filters
                    </span>
                    <Button type="link" onClick={clearAllFilters} className="!p-0 !h-auto !text-green-700 !hover:text-green-900">
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
            <div className={`
        ${isMobileFilterVisible ? 'hidden sm:block' : 'block'}
        
        w-full sm:w-2/3 md:w-3/4 lg:w-4/5
      `}>
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-green-600">FreshCart</h1>
                </div>

                {/* Search input on the right */}
                <div className="flex-1 flex justify-end">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for groceries, products..."
                    value={query}
                    onChange={handleSearch}
                    autoFocus={!!initialQuery} // Auto-focus when there's an initial query
                    className="w-full md:w-1/2 border rounded-full px-5 py-2 shadow-sm focus:outline-green-500"
                  />
                </div>
              </div>

              {/* Results Header */}
              <div className="flex justify-between items-center mb-6 mt-4">
                <Text className="text-gray-600">
                  {query > 0
                    ? `Showing ${filteredProducts?.length} of ${searchedProduct?.length} search results`
                    : `Showing ${filteredProducts?.length} of ${products?.length || 0} products`
                  }
                </Text>
              </div>

              <Row gutter={[24, 24]}>
                {filteredProducts.map(product => (
                  <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={4} key={product._id}>
                    <Card
                      hoverable
                      className="h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                      onClick={() => handleProductDesc(product)}
                      cover={
                        <div className="h-48 overflow-hidden relative bg-gray-100">
                          {product.images && product?.images?.length > 0 ? (
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
                        </div>

                        {/* Add to Cart Button */}
                        <div className="flex items-center justify-between mt-3 w-full space-x-2">
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
                          <Button
                            icon={
                              <ShareAltOutlined className="text-gray-500 group-hover:text-green-600 transition-colors" />
                            }
                            onClick={() => shareProduct(product)}
                            size="middle"
                            className="h-10 w-10 flex items-center justify-center border-gray-300 hover:!border-green-600 rounded-md"
                          />
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {filteredProducts?.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🍎</div>
                  <Title level={4} className="!text-gray-600">
                    {query
                      ? "No search results found matching your search"
                      : "No products found matching your filters"
                    }
                  </Title>
                  <Text className="text-gray-500">

                    {query
                      ? "Try adjusting your search to see more results"
                      : "Try adjusting your filters to see more results"
                    }
                  </Text>

                  {query
                    ? (
                      <Button
                        type="primary"
                        className="mt-4 ml-7 bg-green-600 hover:!bg-green-700 border-green-600"
                        onClick={() => setQuery("")}
                      >
                        Clear Search
                      </Button>
                    )
                    : (
                      <Button
                        type="primary"
                        className="mt-4 ml-7 bg-green-600 hover:!bg-green-700 border-green-600"
                        onClick={clearAllFilters}
                      >
                        Clear All Filters
                      </Button>
                    )
                  }

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