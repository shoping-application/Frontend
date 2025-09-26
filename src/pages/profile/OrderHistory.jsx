import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Input,
  Button,
  Select,
  Tag,
  Typography,
  Divider,
  Pagination,
  Row,
  Col,
  Modal,
  Descriptions,
  Image
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getAllOrders } from "../../../redux/thunk/cartThunk";

const { Title, Text } = Typography;
const { Option } = Select;

const OrderHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Group orders by orderId (same logic as DeliveryStatus component)
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
  const groupedOrders = groupOrdersByOrderId(orders);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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

  // Map backend status to display status
  const getDisplayStatus = (status) => {
    const statusMap = {
      'pending': 'Processing',
      'confirmed': 'Processing',
      'out_for_delivery': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || 'Processing';
  };

  // Status tag colors
  const statusColors = {
    'Delivered': 'green',
    'Shipped': 'blue',
    'Processing': 'orange',
    'Cancelled': 'red',
  };

  // Prepare data for table
  const tableData = groupedOrders.map(order => ({
    key: order.orderId,
    orderId: order.orderId,
    date: formatDate(order.createdAt),
    total: order.totalAmount,
    status: getDisplayStatus(order.status),
    originalOrder: order // Store the full order object for details
  }));

  // Filter and sort orders based on user selections
  const filteredOrders = tableData
    .filter(order => {
      const matchesSearch = order.orderId.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.originalOrder.createdAt) - new Date(a.originalOrder.createdAt);
      } else if (sortBy === 'total') {
        return b.total - a.total;
      }
      return 0;
    });

  // Calculate pagination
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Show order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order.originalOrder);
    setIsModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: 'ORDER #',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'TOTAL AMOUNT',
      dataIndex: 'total',
      key: 'total',
      render: (amount) => formatPrice(amount),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]} className="font-semibold">
          {status}
        </Tag>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          className="p-0 !text-green-600 hover:!text-green-800"
          onClick={() => handleViewDetails(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

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
    <div className="bg-white rounded-lg p-6 max-w-6xl mx-auto">
      <Title level={2} className="mb-2">Your Order History</Title>
      <Text type="secondary" className="text-base">
        Review your past orders and their status.
      </Text>

      <Divider className="my-6" />

      {/* Filters and Search */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Search by Order #"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            value={sortBy}
            onChange={setSortBy}
            className="w-full"
            suffixIcon={<FilterOutlined />}
          >
            <Option value="date">Sort by Date</Option>
            <Option value="total">Sort by Total</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-full"
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">All Status</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Shipped">Shipped</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Col>
      </Row>

      {/* Orders Table */}
      <Table
        columns={columns}
        dataSource={paginatedOrders}
        pagination={false}
        className="mb-6"
        scroll={{ x: true }}
        locale={{
          emptyText: (
            <div className="text-center py-8">
              <ShoppingOutlined className="text-4xl text-gray-300 mb-4" />
              <Text type="secondary">No orders found</Text>
            </div>
          )
        }}
      />

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Text type="secondary">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} results
        </Text>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredOrders.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger={false}
          itemRender={(current, type, originalElement) => {
            if (type === 'prev') {
              return <Button icon={<ArrowLeftOutlined />}>Previous</Button>;
            }
            if (type === 'next') {
              return <Button icon={<ArrowRightOutlined />}>Next</Button>;
            }
            return originalElement;
          }}
        />
      </div>

      {/* Order Details Modal */}
      <Modal
        title={<Title level={3}>Order Details - #{selectedOrder?.orderId}</Title>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedOrder && (
          <div>
            {/* Order Summary */}
            <Descriptions bordered column={1} className="mb-6">
              <Descriptions.Item label="Order Date">
                {formatDate(selectedOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[getDisplayStatus(selectedOrder.status)]}>
                  {getDisplayStatus(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <Text strong>{formatPrice(selectedOrder.totalAmount)}</Text>
              </Descriptions.Item>
            </Descriptions>

            {/* Order Items */}
            <Title level={4}>Order Items ({selectedOrder.items.length})</Title>
            <div className="space-y-4 mt-4">
              {selectedOrder.items.map((item, index) => (
                <Card key={index} size="small" className="mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Image
                        width={60}
                        height={60}
                        src={item.product?.images?.[0]?.url || "https://via.placeholder.com/60x60?text=Product"}
                        alt={item.product?.name}
                        className="rounded object-cover"
                        fallback="https://via.placeholder.com/60x60?text=Product"
                      />
                      <div>
                        <Text strong className="block">{item.product?.name}</Text>
                        <Text type="secondary" className="text-sm">
                          Quantity: {item.quantity} × {formatPrice(item.product?.price)}
                        </Text>
                        <div>
                          <Tag color="blue" className="text-xs">
                            {item.product?.category}
                          </Tag>
                          {item.product?.organic && (
                            <Tag color="green" className="text-xs">Organic</Tag>
                          )}
                        </div>
                      </div>
                    </div>
                    <Text strong>{formatPrice(item.itemTotal)}</Text>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Calculation */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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
                <Divider className="my-2" />
                <div className="flex justify-between">
                  <Text strong>Total Amount</Text>
                  <Text strong type="success">
                    {formatPrice(selectedOrder.totalAmount * 1.05)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;