import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserDetail, updateUserDetail } from "../../../redux/thunk/authThunk"
import { Form, Input, Button, DatePicker } from "antd";
import dayjs from "dayjs";

import { useLocation } from "react-router-dom";

import Address from "./Address"
import OrderHistory from "./OrderHistory"
import Logout from "./Logout"
import Header from '../header/Header';
import DeliveryStatus from "./DelivaryStatus"

const Profile = () => {
  const [activeTab, setActiveTab] = useState('PersonalInfo');
  const location = useLocation();
  const { success } = location.state || {};

  const [form] = Form.useForm();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const dispatch = useDispatch()

  const userDetail = useSelector((state) => state?.user?.userDetail);

  console.log("userDetail", userDetail)

  useEffect(() => {
  if (success) {
    setActiveTab("DeliveryStatus");
  }
}, [success]);


  useEffect(() => {
    if (userDetail) {
      form.setFieldsValue({
        fullName: userDetail.name,
        phoneNumber: userDetail.phoneNumber,
        email: userDetail.email,
        dateOfBirth: userDetail.dateOfBirth
          ? dayjs(userDetail.dateOfBirth)
          : null,
      });
    }
  }, [userDetail, form]);

  useEffect(() => {
    dispatch(getUserDetail(userId))
  }, [dispatch, userId])

  const handleUpdateUser = (values) => {
    console.log(" handleUpdateUser handleUpdateUser")
    dispatch(updateUserDetail(values))
  }


  const tabs = [
    { id: 'PersonalInfo', label: 'Personal Info' },
    { id: 'Addresses', label: 'Addresses' },
    { id: 'OrderHistory', label: 'Order History' },
    { id: "DeliveryStatus", label: "Delivery Status" },
    { id: 'Logout', label: 'Logout' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "PersonalInfo":
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Personal Information
            </h2>

            <Form
              layout="vertical"
              form={form}
              onFinish={handleUpdateUser}
              initialValues={{
                fullName: userDetail?.name,
                phoneNumber: userDetail?.phoneNumber,
                email: userDetail?.email,
                dateOfBirth: userDetail?.dateOfBirth
                  ? dayjs(userDetail.dateOfBirth, "YYYY-MM-DD")
                  : null,
              }}
              className="space-y-4"
              requiredMark={false}
            >
              <Form.Item
                label="Full Name"
                name="fullName"
              >
                <Input
                  className="px-4 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-green-500 
                           focus:border-transparent"
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phoneNumber"
              >
                <Input
                  type="tel"
                  className="px-4 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-green-500 
                           focus:border-transparent"
                />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
              >
                <Input
                  type="email"
                  disabled
                  className="px-4 py-2 border !text-black border-gray-300 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-green-500 
               focus:border-transparent bg-gray-100 cursor-not-allowed"
                />
              </Form.Item>

              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
                rules={[{ required: true, message: "Please select your date of birth" }]}
              >
                <DatePicker
                  className="w-full px-4 py-2"
                  format="YYYY-MM-DD"
                />
              </Form.Item>

              <Form.Item>
                <button
                  type="submit"
                  className="mt-2 bg-green-600 text-white py-2 px-6 
                           rounded-md hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              </Form.Item>
            </Form>
          </div>
        );

      case "Addresses":
        return (
          <Address />
        );
      case "OrderHistory":
        return (
          <OrderHistory />
        );
      case "DeliveryStatus":
        return (
          <DeliveryStatus />
        )
      case "Logout":
        return (
          <Logout />
        )

    }
  };

  return (
    <div>
      <Header />

      <div className="max-w-6xl min-h-[100vh] bg-green-50   mx-auto px-4 py-8">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences.</p>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex items-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <span className="text-2xl font-bold text-green-800">AD</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{userDetail?.name}</h2>
            <p className="text-gray-600">{userDetail?.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                      ? 'bg-green-100 text-green-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;