import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getAllOrders } from "../../../redux/thunk/cartThunk";
import { Modal, Descriptions, Tag, Divider, Card, Image } from 'antd';

const DeliveryStatus = () => {
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const { orders: allOrders, loading } = useSelector((state) => state.cart);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

    console.log("All orders from Redux:", allOrders);

    // Group orders by orderId
    const groupOrdersByOrderId = (orders) => {
        const grouped = {};

        orders?.forEach(order => {
            if (!grouped[order.orderId]) {
                grouped[order.orderId] = {
                    orderId: order.orderId,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    user: order.user,
                    status: order.status,
                    items: [],
                    totalAmount: 0
                };
            }

            // Add item to the order
            grouped[order.orderId].items.push({
                product: order.product,
                quantity: order.quantity,
                itemTotal: order.product?.price * order.quantity
            });

            // Update total amount
            grouped[order.orderId].totalAmount += order.product?.price * order.quantity;
        });

        return Object.values(grouped);
    };

    // Get grouped orders
    const groupedOrders = groupOrdersByOrderId(allOrders);
    console.log("Grouped orders:", groupedOrders);

    // Sort orders by createdAt date (newest first)
    const sortedOrders = groupedOrders?.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    ) || [];

    // Get the most recent order as current order
    const currentOrder = sortedOrders.length > 0 ? sortedOrders[0] : null;

    // Get past orders (all orders except the most recent one)
    const pastOrders = sortedOrders.length > 1 ? sortedOrders.slice(1) : [];

    // Status configuration
    const getStatusConfig = (status) => {
        const config = {
            pending: { label: 'Order Placed', color: 'blue', progress: 25 },
            confirmed: { label: 'Confirmed', color: 'orange', progress: 50 },
            out_for_delivery: { label: 'Out for Delivery', color: 'purple', progress: 75 },
            delivered: { label: 'Delivered', color: 'green', progress: 100 },
            cancelled: { label: 'Cancelled', color: 'red', progress: 0 }
        };
        return config[status] || config.pending;
    };

    // Status steps based on current order status
    const getStatusSteps = (orderStatus) => {
        const allSteps = [
            { key: 'pending', label: 'Order Placed' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'out_for_delivery', label: 'Out for Delivery' },
            { key: 'delivered', label: 'Delivered' }
        ];

        const currentStatusIndex = allSteps.findIndex(step => step.key === orderStatus);

        return allSteps.map((step, index) => ({
            ...step,
            completed: index <= currentStatusIndex,
            current: index === currentStatusIndex
        }));
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(price);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Format date with time for modal
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get display status for modal
    const getDisplayStatus = (status) => {
        const statusMap = {
            'pending': 'Processing',
            'confirmed': 'Confirmed',
            'out_for_delivery': 'Out for Delivery',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || 'Processing';
    };

    // Handle view details button click
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Status</h1>
                    <p className="text-gray-600">Track your current order and view past deliveries</p>
                </div>

                {/* Current Delivery Section */}
                {currentOrder ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Current Delivery</h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                    {currentOrder.status === 'out_for_delivery' ? 'Live Tracking' : (<h3 className="text-base font-bold">
                                        {currentOrder.status === 'pending' && 'Order Placed'}
                                        {currentOrder.status === 'confirmed' && 'Order Confirmed'}
                                        {currentOrder.status === 'out_for_delivery' && 'Out for Delivery'}
                                        {currentOrder.status === 'delivered' && 'Delivered'}
                                        {currentOrder.status === 'cancelled' && 'Cancelled'}
                                    </h3>)}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Order Info */}
                            <div className="mb-6">
                                <p className="text-gray-600 text-sm">Order #{currentOrder.orderId}</p>
                                <h3 className="text-2xl font-bold text-green-600 mt-1">
                                    {currentOrder.status === 'pending' && 'Order Placed'}
                                    {currentOrder.status === 'confirmed' && 'Order Confirmed'}
                                    {currentOrder.status === 'out_for_delivery' && 'Out for Delivery'}
                                    {currentOrder.status === 'delivered' && 'Delivered'}
                                    {currentOrder.status === 'cancelled' && 'Cancelled'}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    Placed on {formatDate(currentOrder.createdAt)}
                                </p>
                            </div>

                            {/* Progress Timeline - Only show for non-cancelled orders */}
                            {currentOrder.status !== 'cancelled' && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        {getStatusSteps(currentOrder.status).map((step, index) => (
                                            <div key={step.key} className="flex flex-col items-center flex-1">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.completed
                                                    ? 'bg-green-500 text-white'
                                                    : step.current
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                    {step.completed ? '✓' : index + 1}
                                                </div>
                                                <span className={`text-sm font-medium text-center ${step.current ? 'text-blue-600' :
                                                    step.completed ? 'text-green-600' : 'text-gray-500'
                                                    }`}>
                                                    {step.label}
                                                </span>
                                                {step.current && currentOrder.status === 'out_for_delivery' && (
                                                    <span className="text-green-600 text-xs font-medium mt-1">
                                                        Arriving soon
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${getStatusConfig(currentOrder.status).progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Cancelled Order Message */}
                            {currentOrder.status === 'cancelled' && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-red-600 text-2xl mr-3">❌</span>
                                        <div>
                                            <h4 className="font-semibold text-red-800">Order Cancelled</h4>
                                            <p className="text-red-600 text-sm">This order has been cancelled and will not be delivered.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Items in this order ({currentOrder.items?.length})</h4>
                                <div className="space-y-3">
                                    {currentOrder.items?.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={item.product?.images?.[0]?.url || "https://via.placeholder.com/50x50?text=Product"}
                                                    alt={item.product?.name}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                                <div>
                                                    <span className="font-medium block">{item.product?.name}</span>
                                                    <span className="text-gray-500 text-sm">
                                                        Qty: {item.quantity} × {formatPrice(item.product?.price)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="font-semibold">
                                                {formatPrice(item.itemTotal)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span>{formatPrice(currentOrder.totalAmount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Delivery Fee</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax (5%)</span>
                                            <span>{formatPrice(currentOrder.totalAmount * 0.05)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                                            <span>Total Amount</span>
                                            <span className="text-green-700">
                                                {formatPrice(currentOrder.totalAmount * 1.05)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-8">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Orders</h3>
                        <p className="text-gray-600">You don't have any orders in progress at the moment.</p>
                    </div>
                )}

                {/* Past Deliveries Section */}
                {pastOrders.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Past Deliveries ({pastOrders.length})
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {pastOrders.map((order) => (
                                <div key={order.orderId} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-100' :
                                                order.status === 'cancelled' ? 'bg-red-100' : 'bg-gray-100'
                                                }`}>
                                                <span className="text-lg">
                                                    {order.status === 'delivered' ? '✅' :
                                                        order.status === 'cancelled' ? '❌' : '⏳'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="font-semibold text-gray-900">
                                                        Order #{order.orderId}
                                                    </h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {order.status === 'delivered' ? 'Delivered' :
                                                            order.status === 'cancelled' ? 'Cancelled' :
                                                                order.status === 'pending' ? 'Pending' :
                                                                    order.status === 'confirmed' ? 'Confirmed' :
                                                                        order.status === 'out_for_delivery' ? 'Out for Delivery' :
                                                                            'Processing'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm">
                                                    {formatDate(order.createdAt)}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {order.items?.length} items • {formatPrice(order.totalAmount)}
                                                </p>

                                                {/* Order items preview */}
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {order.items?.slice(0, 3).map((item, index) => (
                                                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                            {item.product?.name} ({item.quantity})
                                                        </span>
                                                    ))}
                                                    {order.items?.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                            +{order.items.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <button
                                                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                View Details
                                                <span className="ml-1">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {sortedOrders.length === 0 && !loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Order History</h3>
                        <p className="text-gray-600">You haven't placed any orders yet.</p>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            <Modal
                title={<h3 className="text-xl font-semibold">Order Details - #{selectedOrder?.orderId}</h3>}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <button
                        key="close"
                        onClick={() => setIsModalVisible(false)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                ]}
                width={800}
            >
                {selectedOrder && (
                    <div>
                        {/* Order Summary */}
                        <div className="mb-6 border border-gray-200 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                                <div className="p-4">
                                    <div className="text-sm text-gray-600">Order Date</div>
                                    <div className="font-medium">{formatDateTime(selectedOrder.createdAt)}</div>
                                </div>
                                <div className="p-4">
                                    <div className="text-sm text-gray-600">Status</div>
                                    <div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    selectedOrder.status === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' :
                                                        selectedOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-orange-100 text-orange-800'
                                            }`}>
                                            {getDisplayStatus(selectedOrder.status)}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="text-sm text-gray-600">Total Amount</div>
                                    <div className="font-bold text-lg text-green-700">{formatPrice(selectedOrder.totalAmount * 1.05)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <h4 className="font-semibold text-gray-900 mb-4">Order Items ({selectedOrder.items.length})</h4>
                        <div className="space-y-3 mb-6">
                            {selectedOrder.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={item.product?.images?.[0]?.url || "https://via.placeholder.com/60x60?text=Product"}
                                            alt={item.product?.name}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div>
                                            <div className="font-medium">{item.product?.name}</div>
                                            <div className="text-gray-500 text-sm">
                                                Qty: {item.quantity} × {formatPrice(item.product?.price)}
                                            </div>
                                            <div className="flex gap-1 mt-1">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                    {item.product?.category}
                                                </span>
                                                {item.product?.organic && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                        Organic
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-semibold">{formatPrice(item.itemTotal)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Order Calculation */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(selectedOrder.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (5%)</span>
                                    <span>{formatPrice(selectedOrder.totalAmount * 0.05)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total Amount</span>
                                        <span className="text-green-700">{formatPrice(selectedOrder.totalAmount * 1.05)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DeliveryStatus;