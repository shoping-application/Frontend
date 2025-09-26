import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, Input, Radio, Spin, Tag, Modal } from 'antd';
import {
  CreditCardOutlined,
  SafetyOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { createOrder,verifyPayment } from "../../../redux/thunk/productThunk"
import { useDispatch } from 'react-redux';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Payment = () => {
  const dispatch = useDispatch();

  const { order } = useSelector((state) => state.product);

  console.log("order order", order)

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { products: cartItems } = useSelector((state) => state.cart);
  const user = useSelector((state) => state?.user?.user);
  const addresses = useSelector((state) => state?.address?.address);
  const navigate = useNavigate();

  const defaultAddress = addresses?.find(addr => addr.isDefault);

  // Calculate order summary
  const orderSummary = React.useMemo(() => {
    const subtotal = cartItems?.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0) || 0;

    const deliveryFee = 0;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;

    return {
      subtotal,
      delivery: deliveryFee,
      tax,
      total: Math.round(total), // Razorpay requires integer amount
      items: cartItems?.map(item => ({
        id: item._id,
        name: item.product?.name,
        price: item.product?.price,
        quantity: item.quantity,
        weight: item.product?.weight,
        image: item.product?.images?.[0]?.url
      })) || []
    };
  }, [cartItems]);

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const createRazorpayOrder = async () => {
    try {
      const values = {
        amount: orderSummary.total * 100, // Razorpay expects paise
        currency: "INR",
      };

      // Dispatch thunk and wait for result
      const resultAction = await dispatch(createOrder({ values }));

      if (createOrder.fulfilled.match(resultAction)) {
        // Return the order object from Redux
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload || "Order creation failed");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  // Step 2: Initialize Razorpay payment
  const initializeRazorpayPayment = async () => {
    try {
      // Create order on your backend first
      const order = await createRazorpayOrder();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount, // paise
        currency: order.currency,
        name: "FreshCart",
        description: "Order Payment",
        order_id: order.id, // order_RLYqPIVKcMkZZE
        handler: async function (response) {
          await payment(response);
          setIsProcessing(false);
          setShowSuccessModal(true);

          setTimeout(() => {
            navigate("/order-success", {
              state: {
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                amount: orderSummary.total,
              },
            });
          }, 1500);
        },
        prefill: {
          name: user?.name || 'Customer',
          email: user?.email || 'customer@example.com',
          contact: user?.phoneNumber || '9999999999'
        },
        notes: {
          address: "FreshCart Order"
        },
        theme: {
          color: "#10B981" // Green theme
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
          escape: false,
          backdropclose: false
        }
      };

      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);

    } catch (error) {
      console.error('Payment initialization failed:', error);
      setIsProcessing(false);
      toast.error('Payment failed. Please try again.');
    }
  };

  // Step 3: Verify payment on backend
  const payment = async (paymentResponse) => {

    console.log("paymentResponse paymentResponse",paymentResponse)
    try {
      await dispatch(verifyPayment(paymentResponse)).unwrap();
      toast.success("Order placed and payment verified successfully!");
      navigate("/order-success", {
        state: {
          orderId: order.id,
          paymentId: paymentResponse.razorpay_payment_id,
          amount: orderSummary.total,
        },
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);

    try {
      await initializeRazorpayPayment();
    } catch (error) {
      setIsProcessing(false);
      console.log(error);

      toast.error('Payment initialization failed');
    }
  };

  // Handle other payment methods
  const handleOtherPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        toast.success('Payment successful! Order confirmed.');
        navigate("/order-success", {
          state: {
            orderId: 'ORD_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            paymentMethod: paymentMethod,
            amount: orderSummary.total
          }
        });
      }, 1500);
    }, 2000);
  };

  // Main payment handler
  const handlePayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      handleOtherPayment();
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment</h1>
        <p className="text-gray-600 mb-6">Your cart is empty. Please add items to proceed with payment.</p>
        <Button type="primary" onClick={() => window.history.back()}>
          Back to Cart
        </Button>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment</h1>
        <p className="text-gray-600 mb-6">Your cart is empty. Please add items to proceed with payment.</p>
        <Button type="primary" onClick={() => window.history.back()}>
          Back to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span className="text-green-600">Cart</span> / <span className="text-green-600">Checkout</span> / Payment
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <Card
            title="Payment Method"
            className="mb-6"
            extra={<SafetyOutlined className="text-green-600" />}
          >
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full"
            >
              <div className="space-y-1">
                {/* Razorpay Option */}
                <Radio value="razorpay" className="w-full">
                  <div className="flex items-center justify-between w-full ml-2">
                    <div className="flex items-center">
                      <img
                        src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/razorpay-icon.png"
                        alt="Razorpay"
                        className="h-16 w-14 mr-3"
                      />
                      <span className="font-medium">Pay with Razorpay</span>
                    </div>
                    <Tag color="green">Recommended</Tag>
                  </div>
                </Radio>

                {paymentMethod === 'razorpay' && (
                  <div className="ml-8 mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start mb-3">
                      <CheckCircleOutlined className="text-green-600 mt-1 mr-2" />
                      <div>
                        <p className="font-medium text-green-800">Secure Razorpay Payment</p>
                        <p className="text-sm text-green-700">
                          You'll be redirected to Razorpay's secure payment gateway.
                          No card details are stored on our servers.
                        </p>
                      </div>
                    </div>

                    {/* Test Mode Notice */}
                    <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                      <p className="text-xs text-yellow-800 font-medium">
                        🚧 Demo Mode: This is a simulation. No real payment will be processed.
                      </p>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                <Radio value="cod" className="w-full">
                  <div className="flex items-center justify-between w-full ml-4">
                    <div className="flex items-center">
                      <span className="text-xl mr-6">💰</span>
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <Tag color="orange ">Pay when delivered</Tag>
                  </div>
                </Radio>
              </div>
            </Radio.Group>
          </Card>

          {/* Order Summary */}
          <Card title="Order Summary">
            <div className="space-y-4">
              {orderSummary.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image || "https://via.placeholder.com/50x50?text=Product"}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(orderSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>{formatPrice(orderSummary.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-green-700">{formatPrice(orderSummary.total)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Action Sidebar */}
        <div className="lg:col-span-1">
          <Card title="Complete Payment" className="sticky top-8">
            {/* User Information */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center text-gray-700 mb-2">
                  <UserOutlined className="mr-2" />
                  <span className="font-medium">Customer</span>
                </div>
                <p className="text-sm text-gray-600">{user?.name || 'Guest User'}</p>
              </div>

              <div>
                <div className="flex items-center text-gray-700 mb-2">
                  <PhoneOutlined className="mr-2" />
                  <span className="font-medium">Contact</span>
                </div>
                <p className="text-sm text-gray-600">{user?.phoneNumber || 'Not provided'}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              <div>
                <div className="flex items-center text-gray-700 mb-2">
                  <EnvironmentOutlined className="mr-2" />
                  <span className="font-medium">Delivery Address</span>
                </div>
                <p className="text-sm text-gray-600">
                  {defaultAddress
                    ? `${defaultAddress.addressLabel}, ${defaultAddress.streetAdress}, ${defaultAddress.city}, ${defaultAddress.state} - ${defaultAddress.postalCode}, ${defaultAddress.country}`
                    : 'Address not specified'}
                </p>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="mb-6 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 font-medium">🚚 Free Delivery</p>
              <p className="text-xs text-green-600">Estimated delivery: 30-45 minutes</p>
            </div>

            {/* Payment Button */}
            <Button
              type="primary"
              size="large"
              onClick={handlePayment}
              disabled={isProcessing}
              loading={isProcessing}
              className="w-full h-12 bg-green-600 hover:!bg-green-700 border-none text-lg font-semibold"
            >
              {isProcessing ? 'Processing...' : `Pay ${formatPrice(orderSummary.total)}`}
            </Button>

            {/* Security Notice */}
            <div className="mt-4 text-center">
              <SafetyOutlined className="text-green-600 mr-1" />
              <span className="text-xs text-gray-500">Secure SSL encrypted payment</span>
            </div>

            {/* Demo Notice */}
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-700 text-center">
                💡 This is a demo. No real payment will be processed.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        title="Payment Successful!"
        open={showSuccessModal}
        footer={null}
        closable={false}
        centered
      >
        <div className="text-center py-4">
          <CheckCircleOutlined className="text-green-500 text-4xl mb-4" />
          <h3 className="text-lg font-semibold mb-2">Thank you for your order!</h3>
          <p className="text-gray-600 mb-4">
            Your payment of {formatPrice(orderSummary.total)} has been processed successfully.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to order confirmation...
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Payment;