import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import {
  StarFilled,
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { Button, Rate, Tag, message } from 'antd';
import Header from './header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from "../../redux/thunk/cartThunk"

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDescription = () => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { product } = location.state || {};

  const { product: relatedProducts } = useSelector((state) => state.product);

  console.log("products products", product);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!product) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600">Product not found</h2>
            <Button
              type="primary"
              onClick={() => navigate(-1)}
              className="mt-4 bg-green-600 hover:!bg-green-700"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      author: "Sophia Clark",
      time: "2 weeks ago",
      rating: 5,
      comment: "Excellent quality tea with rich flavor. The aroma is amazing and it brews perfectly every time.",
      likes: 15,
      dislikes: 2,
      verified: true
    },
    {
      id: 2,
      author: "Ethan Miller",
      time: "1 month ago",
      rating: 4,
      comment: "Good quality tea, though sometimes the flavor varies between batches. Overall, a reliable choice.",
      likes: 8,
      dislikes: 3,
      verified: true
    }
  ];


  const handleAddToCart = () => {

    dispatch(addToCart({
      product: product._id,
      quantity
    }))
      .unwrap()
      .then(() => {
        toast.success(`${product.name} added to cart`);
      })
      .catch((err) => {
        toast.error(err || "Failed to add to cart");
      });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.info(!isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('Product link copied to clipboard!');
    }
  };

  const handleProductDesc = (product) => {
    navigate("/description", { state: { product } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            type="text"
            className="flex items-center text-gray-600"
          >
            Back to Products
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="relative h-[25rem] rounded-lg overflow-hidden">
                <img
                  src={product.images?.[currentImageIndex]?.url || "https://via.placeholder.com/600x600?text=Product+Image"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />

                {/* Favorite Button */}
                <Button
                  type="text"
                  icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                  onClick={toggleFavorite}
                  className="absolute top-4 right-4 bg-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center"
                  style={{ color: isFavorite ? '#ff4d4f' : '#666' }}
                />

                {/* Organic Badge */}
                {product.organic && (
                  <Tag color="green" className="absolute top-4 left-4 font-semibold text-sm py-1 px-3">
                    ORGANIC
                  </Tag>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 mt-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${currentImageIndex === index ? 'border-green-500' : 'border-gray-200'
                        }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Tag color="green" className="mb-3 text-sm font-semibold">
                {product.brand}
              </Tag>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <Rate
                  disabled
                  defaultValue={product.ratings?.average || 0}
                  className="text-yellow-400"
                />
                <span className="text-gray-600">({product.ratings?.count || 0} reviews)</span>
                <span className="text-green-600 font-semibold">In Stock</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-4xl font-bold text-green-700">₹{product.price}</span>
                {product.weight && (
                  <span className="text-lg text-gray-600">
                    / {product.weight.value}
                    {product.weight.unit}
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg bg-white">
                  <Button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-12 h-12 text-xl font-bold border-none"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-12 h-12 text-xl font-bold border-none"
                  >
                    +
                  </Button>
                </div>
                <span className="text-gray-500 text-sm">
                  {product.weight && `${product.weight.value}${product.weight.unit} each`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  size="large"
                  className="flex-1 h-12 text-lg font-semibold bg-green-600 hover:!bg-green-700 border-none"
                >
                  Add to Cart
                </Button>
                <Button
                  icon={<ShareAltOutlined className="text-gray-500 group-hover:text-green-600 transition-colors" />}
                  onClick={shareProduct}
                  size="large"
                  className="h-14 w-14 border-gray-300 hover:!border-green-700"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckOutlined className="text-green-500" />
                  <span className="text-gray-700">100% Natural</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckOutlined className="text-green-500" />
                  <span className="text-gray-700">Freshly Packed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckOutlined className="text-green-500" />
                  <span className="text-gray-700">Free Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckOutlined className="text-green-500" />
                  <span className="text-gray-700">Quality Assured</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Rating Summary */}
            <div className="lg:col-span-1 text-center lg:text-left">
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {product.ratings?.average || 0}
                </div>
                <Rate disabled defaultValue={product.ratings?.average || 0} className="text-yellow-400 text-lg mb-2" />
                <div className="text-gray-600">{product.ratings?.count || 0} reviews</div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{review.author}</h3>
                        {review.verified && (
                          <Tag color="green" className="text-xs mt-1">Verified Purchase</Tag>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">{review.time}</span>
                    </div>

                    <Rate disabled defaultValue={review.rating} className="text-yellow-400 text-sm mb-3" />

                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <span>👍</span>
                        <span>{review.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-gray-700">
                        <span>👎</span>
                        <span>{review.dislikes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>



        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-green-700">You Might Also Like</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts?.map((relatedProduct) => (
              <div
                key={relatedProduct?._id}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow hover:cursor-pointer duration-300"
                onClick={() => handleProductDesc(relatedProduct)}
              >
                <div className="p-2">
                  <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={relatedProduct?.images?.[0]?.url || "https://via.placeholder.com/300x300?text=No+Image"}
                      alt={relatedProduct?.name}
                      className="h-full w-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    />
                  </div>



                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {relatedProduct?.name}
                    </h3>
                    <span className="text-green-700 font-bold text-lg">
                      ₹{relatedProduct?.price}
                    </span>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDescription;