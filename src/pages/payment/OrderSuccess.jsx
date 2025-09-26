import React,{useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Typography } from 'antd';
import Header from '../header/Header';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch} from 'react-redux';
import {clearCart ,getAllOrders} from "../../../redux/thunk/cartThunk"

const { Title, Paragraph, Text } = Typography;

const OrderSuccessPage = () => {
    const { orders:products, loading } = useSelector((state) => state.cart);

    const dispatch=useDispatch()

    console.log("products products", products);
    const navigation=useNavigate()

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(()=>{
        dispatch(getAllOrders())
        dispatch(clearCart())
    },[dispatch])



    const processCartItems = () => {
        if (!products || products.length === 0) return [];

        return products.map(item => ({
            id: item._id, // use the unique order item ID
            name: item.product?.name || 'Unknown Product',
            description: item.product?.description || '',
            price: item.product?.price || 0,
            quantity: item.quantity,
            weight: item.product?.weight || {},
            image: item.product?.images?.[0] || ''
        }));
    };
    const cartItems = processCartItems();

    const calculateOrderTotals = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 0 ? 2.99 : 0;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + deliveryFee + tax;

        return { subtotal, deliveryFee, tax, total };
    };

    const { subtotal, deliveryFee, tax, total } = calculateOrderTotals();

    // Order details
    const orderDetails = {
        id: `SPDY${Date.now().toString().slice(-9)}`,
        estimatedDelivery: "Today, 4:30 PM - 5:00 PM",
        items: cartItems,
        subtotal,
        deliveryFee,
        tax,
        total
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your order...</p>
                </div>
            </div>
        );
    }

    const handleShoping=()=>{
        navigation("/home")
    }

    const handleOrderDetails=()=>{
        navigation("/profile",{ state: { success: true } })
    }

    return (
        <>

            <Header />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8 max-w-xl">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {/* Success Message */}
                        <div className="text-center mb-8">
                            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-28 h-28 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your order!</h2>
                            <p className="text-gray-600">Your order has been placed successfully and is being prepared.</p>
                        </div>

                        {/* Order Details */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Order Number</p>
                                    <p className="font-bold text-gray-900">#{orderDetails.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-sm">Estimated Delivery</p>
                                    <p className="font-bold text-gray-900">{orderDetails.estimatedDelivery}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="my-6" />

                        {/* Order Summary */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                            {/* Order Items */}
                            <div className="space-y-4 mb-6">
                                {orderDetails.items.length > 0 ? (
                                    orderDetails.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500 mb-1 line-clamp-2">
                                                    {item.description.length > 100
                                                        ? `${item.description.substring(0, 100)}...`
                                                        : item.description}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-400">
                                                    <span>Qty: {item.quantity}</span>
                                                    {item.weight && item.weight.value && (
                                                        <span className="ml-2">
                                                            • {item.weight.value} {item.weight.unit}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No items in order</p>
                                )}
                            </div>

                            {/* Order Totals */}
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">₹{orderDetails.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery fee</span>
                                    <span className="text-gray-900">₹{orderDetails.deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (8%)</span>
                                    <span className="text-gray-900">₹{orderDetails.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-gray-900">₹{orderDetails.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <hr className="my-6" />

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                                onClick={handleShoping}
                            >
                                Continue Shoping
                            </button>
                            <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-200"
                                onClick={handleOrderDetails}
                            >
                                View Delivary Status
                            </button>
                        </div>
                    </div>


                </main>

                <footer style={{
                    padding: '40px 50px',
                    background: "black",
                    color: "white",
                    marginTop: '40px'
                }}>
                    <div style={{ margin: '0 auto' }}>
                        <Row gutter={[40, 20]} align="top">
                            {/* Company Name and Tagline on the left */}
                            <Col xs={24} md={12}>
                                <div className="flex flex-col">
                                    {/* Logo + Title in one row */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 text-green-600">
                                            <svg
                                                fill="none"
                                                viewBox="0 0 48 48"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-full h-full"
                                            >
                                                <path
                                                    d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                                                    fill="currentColor"
                                                ></path>
                                            </svg>
                                        </div>
                                        <Title level={3} className="!text-white mb-0">
                                            SwiftMart
                                        </Title>
                                    </div>

                                    {/* Paragraph on next line */}
                                    <Paragraph className="!text-white opacity-80 mt-0 mb-0">
                                        Your daily essentials, delivered in minutes.
                                    </Paragraph>
                                </div>
                            </Col>

                            {/* Navigation links on the right */}
                            <Col xs={24} md={12}>
                                <Row gutter={[40, 20]}>
                                    <Col xs={8} sm={8}>
                                        <Title level={5} className="!text-white mb-4">COMPANY</Title>
                                        <div className="flex flex-col gap-2">
                                            <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">About</div>
                                            <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Careers</div>
                                        </div>
                                    </Col>

                                    <Col xs={8} sm={8}>
                                        <Title level={5} className="!text-white mb-4">SUPPORT</Title>
                                        <div className="flex flex-col gap-2">
                                            <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Help Center</div>
                                            <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Contact Us</div>
                                            <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Terms of Service</div>
                                        </div>
                                    </Col>

                                    <Col xs={8} sm={8}>
                                        <Title level={5} className="!text-white mb-4">LEGAL</Title>
                                        <div className="flex flex-col gap-2">
                                            <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Privacy Policy</div>
                                            <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Cookie Policy</div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {/* Copyright notice */}
                        <div style={{
                            marginTop: '40px',
                            color: '#999',
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            textAlign: 'center'
                        }}>
                            © 2024 SwiftMart, Inc. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default OrderSuccessPage;