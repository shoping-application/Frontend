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
  InputNumber,
  Select,
  Button,
  Pagination,
  Row,
  Col,
  Tag
} from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, updateProduct } from "../../../redux/thunk/productThunk";
import "../Style.css"

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AllProducts = () => {
  const dispatch = useDispatch();
  const { product: products, loading } = useSelector((state) => state.product);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = products?.slice(startIndex, endIndex) || [];
  const totalProducts = products?.length || 0;

  const handleMenuClick = (record, action) => {
    if (action === "edit") {
      setSelectedProduct(record);
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        category: record.category,
        brand: record.brand,
        price: record.price,
        status: record.status,
        organic: record.organic || false,
      });
      setIsModalOpen(true);
    } else if (action === "delete") {
      console.log("Delete clicked for", record);
      // TODO: dispatch deleteProduct(record._id)
    }
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(updateProduct({ id: selectedProduct._id, ...values }));
        setIsModalOpen(false);
        setSelectedProduct(null);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    form.resetFields();
  };

  const menu = (record) => (
    <Menu
      onClick={({ key }) => handleMenuClick(record, key)}
      items={[
        { 
          key: "edit", 
          label: "Edit", 
          icon: <EditOutlined /> 
        },
        { 
          key: "delete", 
          label: "Delete", 
          icon: <DeleteOutlined />,
          danger: true 
        },
      ]}
    />
  );

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "image",
      width: 80,
      render: (images) => {
        const primaryImage =
          images?.find((img) => img.isPrimary)?.url || images?.[0]?.url;
        return (
          <Image
            src={primaryImage}
            alt="product"
            width={50}
            height={50}
            style={{ 
              borderRadius: "8px",
              objectFit: "cover"
            }}
            preview={false}
          />
        );
      },
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      width:150,
      render: (text, record) => (
        <div>
          <div className="font-semibold">{text}</div>
          {record.organic && (
            <Tag color="green" className="text-xs mt-1">
              Organic
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => (
        <Text type="secondary" className="line-clamp-2">
          {text}
        </Text>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue" className="capitalize">
          {category}
        </Tag>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      width:130,
      render: (brand) => <Text strong>{brand}</Text>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width:100,
      render: (price, record) => (
        <div>
          <Text strong className="text-green-600">
            ₹{price}
          </Text>
          <Text type="secondary" className="text-xs block">
            / {record.weight?.value} {record.weight?.unit}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width:120,
      render: (status) => (
        <Tag 
          color={status === "active" ? "green" : "red"} 
          className="font-medium"
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 90,
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
          <Title level={2} className="!mb-0">Fresh Fruits</Title>
          <Text type="secondary">
            Total Products: {totalProducts}
          </Text>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={paginatedProducts}
          pagination={false}
          rowKey="_id"
          className="custom-table"
          scroll={{ x: 1000 }}
          loading={loading}
        />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <Text type="secondary">
            Showing {startIndex + 1} to {Math.min(endIndex, totalProducts)} of {totalProducts} products
          </Text>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalProducts}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={['15', '25', '50', '100']}
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <EditOutlined className="text-blue-600" />
            <span>Edit Product</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
            Cancel
          </Button>,
          <Button 
            key="update" 
            type="primary" 
            onClick={handleUpdate}
            icon={<SaveOutlined />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Update Product
          </Button>,
        ]}
        className="edit-product-modal wide-modal"
      >
        {selectedProduct && (
          <Form
            form={form}
            layout="vertical"
            name="editProductForm"
            className="mt-4"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Product Name"
                  rules={[{ required: true, message: "Please input product name!" }]}
                >
                  <Input placeholder="Enter product name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: 'Please select category' }]}
                >
                  <Select placeholder="Select category">
                    <Option value="fruits & vegetables">Fruits & Vegetables</Option>
                    <Option value="tea & coffee">Tea & Coffee</Option>
                    <Option value="Dairy & Cheese">Dairy & Cheese</Option>
                    <Option value="Packaged Food">Packaged Food</Option>
                    <Option value="meat">Meat</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item 
              name="description" 
              label="Description"
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <TextArea 
                rows={3} 
                placeholder="Enter product description" 
                showCount 
                maxLength={500}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="brand"
                  label="Brand"
                  rules={[{ required: true, message: "Please input brand!" }]}
                >
                  <Input placeholder="Enter brand name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="price"
                  label="Price (₹)"
                  rules={[{ required: true, message: "Please input price!" }]}
                >
                  <InputNumber 
                    className="w-full"
                    placeholder="Enter price"
                    min={0}
                    formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/₹\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  name="status" 
                  label="Status"
                  rules={[{ required: true, message: "Please select status!" }]}
                >
                  <Select placeholder="Select status">
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="organic" 
                  label="Organic"
                  valuePropName="checked"
                >
                  <Select placeholder="Is organic?">
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Product Preview */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <Text strong className="text-gray-600">Product Preview</Text>
              <div className="mt-2 flex items-center space-x-3">
                <Image
                  src={selectedProduct.images?.[0]?.url}
                  alt="preview"
                  width={40}
                  height={40}
                  style={{ borderRadius: "6px" }}
                  preview={false}
                />
                <div>
                  <Text strong>{form.getFieldValue('name') || selectedProduct.name}</Text>
                  <br />
                  <Text type="secondary" className="text-sm">
                    ₹{form.getFieldValue('price') || selectedProduct.price} • {form.getFieldValue('category') || selectedProduct.category}
                  </Text>
                </div>
              </div>
            </div>
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
        
        .edit-product-modal :global(.ant-modal-header) {
          border-bottom: 1px solid #e2e8f0;
        
        }
        
        .edit-product-modal :global(.ant-modal-footer) {
          border-top: 1px solid #e2e8f0;
          padding: 16px 24px;
        }
      `}</style>
    </div>
  );
};

export default AllProducts;