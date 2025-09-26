import React, { useState, useEffect } from "react";
import {
    Table,
    Typography,
    Dropdown,
    Menu,
    Spin,
    Image,
    Modal,
    Form,
    Input,
    Select,
    Button,
    Pagination,
    Row,
    Col,
    Tag,
    Badge,
    Card,
    Descriptions
} from "antd";
import {
    MoreOutlined,
    EditOutlined,
    EyeOutlined,
    SaveOutlined,
    CloseOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdminOrders, updateOrderStatus } from "../../../redux/thunk/cartThunk";

// , updateOrderStatus

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AllOrders = () => {
    const dispatch = useDispatch();
    const { adminOrders: allOrders, loading } = useSelector((state) => state.cart);

    console.log("allOrders allOrders", allOrders)

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllAdminOrders());
    }, [dispatch]);

    // Group orders by orderId
    const groupOrdersByOrderId = (orders) => {
        const grouped = {};

        console.log("orders orders", orders)

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

            grouped[order.orderId].items.push({
                product: order.product,
                quantity: order.quantity,
                itemTotal: order.product?.price * order.quantity
            });

            grouped[order.orderId].totalAmount += order.product?.price * order.quantity;
        });

        return Object.values(grouped);
    };

    // Get grouped orders
    const groupedOrders = groupOrdersByOrderId(allOrders);

    // Sort orders by date (newest first)
    const sortedOrders = groupedOrders?.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    ) || [];

    // Pagination logic
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = sortedOrders?.slice(startIndex, endIndex) || [];
    const totalOrders = sortedOrders?.length || 0;

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
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Status colors
    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            out_for_delivery: 'blue',
            delivered: 'green',
            canceled: 'red'
        };
        return colors[status] || 'gray';
    };

    // Status labels
    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Pending',
            out_for_delivery: 'Out for Delivery',
            delivered: 'Delivered',
            canceled: 'Canceled'
        };
        return labels[status] || status;
    };

    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrderStatus({ orderId, status: newStatus }));
    };

    const handleViewDetails = (record) => {
        setSelectedOrder(record);
        setViewModalOpen(true);
    };

    const handleEditStatus = (record) => {
        setSelectedOrder(record);
        form.setFieldsValue({
            status: record.status,
            notes: ''
        });
        setEditModalOpen(true);
    };

    const handleUpdateStatus = () => {
        form.validateFields()
            .then((values) => {
                dispatch(updateOrderStatus({
                    orderId: selectedOrder.orderId,
                    status: values.status
                }))
                    .unwrap()  
                    .then(() => {
                        setEditModalOpen(false);
                        setSelectedOrder(null);
                        form.resetFields();
                        dispatch(dispatch(getAllAdminOrders()))
                    })
                    .catch((err) => {
                        console.error("Update failed:", err);
                    });
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const handleCancelModal = () => {
        setViewModalOpen(false);
        setEditModalOpen(false);
        setSelectedOrder(null);
        form.resetFields();
    };

    const menu = (record) => (
        <Menu
            onClick={({ key }) => {
                if (key === "view") handleViewDetails(record);
                if (key === "edit") handleEditStatus(record);
            }}
            items={[
                {
                    key: "view",
                    label: "View Details",
                    icon: <EyeOutlined />
                },
                {
                    key: "edit",
                    label: "Update Status",
                    icon: <EditOutlined />
                },
            ]}
        />
    );

    const columns = [
        {
            title: "Order ID",
            dataIndex: "orderId",
            key: "orderId",
            render: (text) => <Text strong className="text-green-700">#{text}</Text>,
        },
        {
            title: "Customer",
            dataIndex: "user",
            key: "customer",
            render: (user) => (
                <div>
                    <div className="font-semibold">{user?.name}</div>
                    <Text type="secondary" className="text-xs">{user?.email}</Text>
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "date",
            render: (date) => formatDate(date),
        },
        {
            title: "Items",
            dataIndex: "items",
            key: "items",
            render: (items) => (
                <div>
                    <Text strong>{items?.length} items</Text>
                    <div className="text-xs text-gray-500">
                        {items?.slice(0, 2).map((item, index) => (
                            <span key={index}>
                                {item.product?.name} ({item.quantity}){index < items.length - 1 && ', '}
                            </span>
                        ))}
                        {items?.length > 2 && ` +${items.length - 2} more`}
                    </div>
                </div>
            ),
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (amount) => (
                <Text strong className="text-green-600">
                    {formatPrice(amount * 1.05)}
                </Text>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Badge
                    color={getStatusColor(status)}
                    text={getStatusLabel(status)}
                    className="font-medium"
                />
            ),
        },
        {
            title: "Actions",
            key: "action",
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    overlay={menu(record)}
                    trigger={["click"]}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<MoreOutlined />}
                        className="flex items-center justify-center"
                    />
                </Dropdown>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Title level={2} className="!mb-0">All Orders</Title>
                    <Text type="secondary">
                        Total Orders: {totalOrders}
                    </Text>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={paginatedOrders}
                    pagination={false}
                    rowKey="orderId"
                    className="custom-table"
                    scroll={{ x: 1000 }}
                    loading={loading}
                />

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <Text type="secondary">
                        Showing {startIndex + 1} to {Math.min(endIndex, totalOrders)} of {totalOrders} orders
                    </Text>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalOrders}
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                        showSizeChanger
                        pageSizeOptions={['15', '25', '50', '100']}
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} orders`
                        }
                    />
                </div>
            </div>

            {/* View Details Modal */}
            <Modal
                title={
                    <div className="flex items-center space-x-2">
                        <EyeOutlined className="text-green-700" />
                        <span>Order Details - #{selectedOrder?.orderId}</span>
                    </div>
                }
                open={viewModalOpen}
                onCancel={handleCancelModal}
                footer={[
                    <Button key="close" onClick={handleCancelModal}
                        className="border-black hover:!border-green-800 hover:!text-green-800"
                    >
                        Close
                    </Button>,
                ]}
                width={800}
                className="view-order-modal"
            >
                {selectedOrder && (
                    <div className="mt-4">
                        {/* Order Summary */}
                        <Card title="Order Summary" className="mb-4">
                            <Descriptions column={2} size="small">
                                <Descriptions.Item label="Customer Name">
                                    <Text strong>{selectedOrder.user?.name}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Customer Email">
                                    <Text>{selectedOrder.user?.email}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Order Date">
                                    <Text>{formatDate(selectedOrder.createdAt)}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Order Status">
                                    <Badge
                                        color={getStatusColor(selectedOrder.status)}
                                        text={getStatusLabel(selectedOrder.status)}
                                        className="font-medium"
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Last Updated">
                                    <Text>{formatDate(selectedOrder.updatedAt)}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Order Items */}
                        <Card title={`Order Items (${selectedOrder.items?.length})`} className="mb-4">
                            <div className="space-y-3">
                                {selectedOrder.items?.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Image
                                                src={item.product?.images?.[0]?.url || "https://via.placeholder.com/50x50?text=Product"}
                                                alt={item.product?.name}
                                                width={50}
                                                height={50}
                                                style={{ borderRadius: "8px", objectFit: "cover" }}
                                                preview={false}
                                            />
                                            <div>
                                                <div className="font-medium">{item.product?.name}</div>
                                                <div className="text-gray-500 text-sm">
                                                    Category: {item.product?.category}
                                                </div>
                                                <div className="text-gray-500 text-sm">
                                                    Brand: {item.product?.brand}
                                                </div>
                                                {item.product?.organic && (
                                                    <Tag color="green" className="text-xs mt-1">Organic</Tag>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{formatPrice(item.itemTotal)}</div>
                                            <div className="text-gray-500 text-sm">
                                                {item.quantity} × {formatPrice(item.product?.price)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Order Calculation */}
                        <Card title="Payment Summary">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Text>Subtotal</Text>
                                    <Text>{formatPrice(selectedOrder.totalAmount)}</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text>Delivery Fee</Text>
                                    <Text type="success">Free</Text>
                                </div>
                                <div className="flex justify-between">
                                    <Text>Tax (5%)</Text>
                                    <Text>{formatPrice(selectedOrder.totalAmount * 0.05)}</Text>
                                </div>
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-lg">
                                        <Text strong>Total Amount</Text>
                                        <Text strong type="success">
                                            {formatPrice(selectedOrder.totalAmount * 1.05)}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </Modal>

            {/* Edit Status Modal */}
            <Modal
                title={
                    <div className="flex items-center space-x-2">
                        <EditOutlined className="text-green-700" />
                        <span>Update Order Status - #{selectedOrder?.orderId}</span>
                    </div>
                }
                open={editModalOpen}
                onCancel={handleCancelModal}
                footer={[
                    <Button key="cancel" onClick={handleCancelModal} icon={<CloseOutlined />}
                        className="border-black hover:!border-green-800 hover:!text-green-800"
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="update"
                        type="primary"
                        onClick={handleUpdateStatus}
                        icon={<SaveOutlined />}
                        className="bg-green-600 hover:!bg-green-700"
                    >
                        Update Status
                    </Button>,
                ]}
                width={600}
                className="edit-order-modal"
            >
                {selectedOrder && (
                    <Form
                        form={form}
                        layout="vertical"
                        name="editOrderForm"
                        className="mt-4"
                    >
                        {/* Order Summary */}
                        <Card size="small" className="mb-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <Text strong>Customer:</Text>
                                    <div>{selectedOrder.user?.name}</div>
                                </div>
                                <div>
                                    <Text strong>Order Date:</Text>
                                    <div>{formatDate(selectedOrder.createdAt)}</div>
                                </div>
                                <div>
                                    <Text strong>Total Amount:</Text>
                                    <div className="text-green-600 font-semibold">
                                        {formatPrice(selectedOrder.totalAmount * 1.05)}
                                    </div>
                                </div>
                                <div>
                                    <Text strong>Items:</Text>
                                    <div>{selectedOrder.items?.length} products</div>
                                </div>
                            </div>
                        </Card>

                        {/* Status Update */}
                        <Form.Item
                            name="status"
                            label="Order Status"
                            rules={[{ required: true, message: "Please select status!" }]}
                        >
                            <Select placeholder="Select order status">
                                <Option value="pending">Pending</Option>
                                <Option value="out_for_delivery">Out for Delivery</Option>
                                <Option value="delivered">Delivered</Option>
                                <Option value="canceled">Canceled</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                )}
            </Modal>

            <style jsx>{`
        .custom-table :global(.ant-table-thead > tr > th) {
          background-color: #f8fafc;
          font-weight: 600;
        }
        
        .custom-table :global(.ant-table-tbody > tr:hover > td) {
          background-color: #f1f5f9 !important;
        }
        
        .view-order-modal :global(.ant-modal-header),
        .edit-order-modal :global(.ant-modal-header) {
          border-bottom: 1px solid #e2e8f0;
        }
        
        .view-order-modal :global(.ant-modal-footer),
        .edit-order-modal :global(.ant-modal-footer) {
          border-top: 1px solid #e2e8f0;
          padding: 16px 24px;
        }
      `}</style>
        </div>
    );
};

export default AllOrders;