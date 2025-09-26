import { useEffect, useState } from 'react';
import Header from '../header/Header';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getUserCart , updateCartItem ,deleteCartItem} from "../../../redux/thunk/cartThunk";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import {updateQuantityOptimistic , removeItemOptimistic} from "../../../redux/slice/cartSlice"

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.cart);
  const [updatingItems, setUpdatingItems] = useState({});

  console.log("Cart products:", products);

  const cartItems=products

  // Calculate totals based on actual API data
  const subtotal = cartItems?.reduce((total, item) => {
    const price = item.product?.price || 0;
    const quantity = item.quantity || 1;
    return total + (price * quantity);
  }, 0) || 0;

  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;
  const itemsCount = cartItems?.reduce((count, item) => count + (item.quantity || 1), 0) || 0;

  // Update item quantity
    const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    const originalQuantity = cartItems.find(item => item._id === cartItemId)?.quantity;
    
    // Optimistic update
    dispatch(updateQuantityOptimistic({ cartItemId, quantity: newQuantity }));
    setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));

    try {
      await dispatch(updateCartItem({ id: cartItemId, quantity: newQuantity })).unwrap();
      toast.success('Quantity updated successfully');
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateQuantityOptimistic({ cartItemId, quantity: originalQuantity }));
      toast.error('Failed to update quantity');
      console.error('Update error:', error);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  // Remove item from cart
   const removeItem = async (cartItemId) => {
    // const itemToRemove = cartItems.find(item => item._id === cartItemId);
    
    // Optimistic remove
    dispatch(removeItemOptimistic(cartItemId));
    
    try {
      await dispatch(deleteCartItem(cartItemId)).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      // Revert optimistic remove on error
      // You'd need to add the item back to the state
      toast.error('Failed to remove item');
      console.error('Remove error:', error);
      // Refresh cart to get correct state
      dispatch(getUserCart());
    }
  };

  useEffect(() => {
    dispatch(getUserCart());
  }, [dispatch]);

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate("/checkout");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Cart</h1>
        <p className="text-gray-600 mb-8">
          {cartItems?.length || 0} {cartItems?.length === 1 ? 'item' : 'items'} in your cart
        </p>

        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious products to get started!</p>
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/home')}
              className="bg-green-600 hover:!bg-green-700"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="space-y-6">
                  {cartItems.map((item) => {
                    const product = item.product;
                    const productPrice = product?.price || 0;
                    const itemQuantity = item.quantity || 1;
                    const itemTotal = productPrice * itemQuantity;
                    const primaryImage = product?.images?.find(img => img.isPrimary) || product?.images?.[0];

                    return (
                      <div key={item._id} className="flex gap-4 border-b pb-6 last:border-0 last:pb-0">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border">
                            <img
                              src={primaryImage?.url || "https://via.placeholder.com/100x100?text=No+Image"}
                              alt={product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {product?.name}
                              </h3>
                              {product?.brand && (
                                <p className="text-gray-500 text-sm">Brand: {product.brand}</p>
                              )}
                              {product?.weight && (
                                <p className="text-gray-500 text-sm">
                                  {product.weight.value}
                                  {product.weight.unit} each
                                </p>
                              )}
                            </div>
                            
                            {/* Price per unit */}
                            <div className="text-right ml-4">
                              <p className="text-green-700 font-bold text-lg">
                                {formatPrice(productPrice)}
                              </p>
                              <p className="text-gray-500 text-sm">per unit</p>
                            </div>
                          </div>

                          {/* Quantity Controls and Total */}
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center space-x-3">
                              {/* Quantity controls */}
                              <div className="flex items-center border rounded-lg bg-gray-50">
                                <Button
                                  type="text"
                                  icon={<MinusOutlined />}
                                  onClick={() => updateQuantity(item._id, itemQuantity - 1)}
                                  disabled={updatingItems[item._id] || itemQuantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center"
                                />
                                <span className="px-3 py-1 min-w-[40px] text-center font-medium">
                                  {updatingItems[item._id] ? (
                                    <Spin size="small" />
                                  ) : (
                                    itemQuantity
                                  )}
                                </span>
                                <Button
                                  type="text"
                                  icon={<PlusOutlined />}
                                  onClick={() => updateQuantity(item._id, itemQuantity + 1)}
                                  disabled={updatingItems[item._id]}
                                  className="w-8 h-8 flex items-center justify-center"
                                />
                              </div>

                              {/* Remove button */}
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeItem(item._id)}
                                className="text-red-500 hover:text-red-700"
                              />
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-gray-600 text-sm">Item Total:</p>
                              <p className="text-green-700 font-bold text-lg">
                                {formatPrice(itemTotal)}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {formatPrice(productPrice)} × {itemQuantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  {subtotal > 500 && (
                    <div className="flex justify-between text-green-600">
                      <span>Delivery Discount</span>
                      <span className="font-medium">- {formatPrice(40)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-700">{formatPrice(total)}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Inclusive of all taxes</p>
                </div>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleCheckout}
                  className="w-full h-12 bg-green-600 hover:!bg-green-700 border-none text-lg font-semibold"
                >
                  Proceed to Checkout
                </Button>

                {/* Additional Benefits */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Benefits</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Free delivery on all orders</li>
                    <li>✓ 7-day return policy</li>
                    <li>✓ Quality guarantee</li>
                    <li>✓ Secure payment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;