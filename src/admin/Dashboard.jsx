import { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
} from 'antd';
import CreateProductInAdmin from "./createProduct/CreateProductInAdmin";

import AllProducts from "./AllProducts/AllProducts"
import AllOrders from './AllOrders.jsx/AllOrders';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('Create Product');

  const menuItems = [
    'Create Product',
    'Orders',
    'All Products',
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'Create Product':
        return <CreateProductInAdmin />;
      case 'Orders':
        return (
          <AllOrders/>
        );
      case 'All Products':
        return <AllProducts/>;

      default:
        // return <CreateProduct />;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#0c1426] to-[#1a243a] min-h-screen text-white">
      {/* Header */}
      <div className="mb-6">
        <Title level={1} className="!text-white mb-2">Admin Dashboard</Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Sidebar - Navigation */}
        <Col xs={24} lg={6}>
          <Card
            className=" bg-opacity-5 border bg-[#0c1426]  border-white border-opacity-10 rounded-lg"
            bodyStyle={{ padding: '16px' }}
          >
            <Title level={4} className="!text-white mb-4">Overview</Title>
            <div className="flex flex-col gap-3">
              {menuItems.map(item => (
                <Text
                  key={item}
                  className={`cursor-pointer  p-2 rounded transition-colors ${activeSection === item
                      ? '!bg-green-300 !text-black font-semibold'
                      : 'text-gray-400 hover:!bg-green-300 hover:text-black'
                    }`}
                  onClick={() => setActiveSection(item)}
                >
                  {item}
                </Text>
              ))}
            </div>
          </Card>
        </Col>

        {/* Main Content Area */}
        <Col xs={24} lg={18}>
          {renderContent()}
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;