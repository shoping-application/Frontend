import { useState, useEffect } from 'react';
import Header from '../header/Header';
import { useNavigate } from "react-router-dom";
import { getAddress, createAddress } from "../../../redux/thunk/addressThunk"
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Input, Button, Select, Switch } from 'antd';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { TextArea } = Input;

const Checkout = () => {
  // State for form values
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('you@example.com');
  const [deliveryTime, setDeliveryTime] = useState('now');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const addresses = useSelector((state) => state?.address?.address)

  console.log("addresses", addresses);

  const user = useSelector((state) => state?.user?.user)

  console.log("user", user);



  useEffect(() => {
    dispatch(getAddress())
  }, [dispatch])

  // Address options

  // Delivery time options
  const deliveryOptions = [
    {
      id: 'now',
      label: 'Now (15 - 20 mins)'
    },
    {
      id: 'today',
      label: 'Today 6PM - 7PM'
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow 10AM - 11AM'
    }
  ];

  const handlePayment = () => {
    navigate("/payment")
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    setLoading(true);

    dispatch(createAddress(values))
      .unwrap()
      .then(() => {
        toast.success("Address created successfully");
        form.resetFields();
        setIsModalVisible(false);
        // dispatch(getAddress());
        dispatch(getAddress()).then((action) => {
          const allAddresses = action.payload; // this is the updated address list
          const newAddress = allAddresses[allAddresses.length - 1];
          setSelectedAddress(newAddress._id);
        });
      })
      .catch((error) => toast.error(error || "Failed to create address"))
      .finally(() => setLoading(false));
  };

  const handleAddAddress = () => {
    setIsModalVisible(true)
  }

  return (
    <>

      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <span className="text-green-600">Cart</span> / Checkout
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Information</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>



              <div className="space-y-4 mb-6">
                {addresses?.map(address => (
                  <div
                    key={address._id}
                    className={`border rounded-md p-4 cursor-pointer transition-colors ${selectedAddress === address._id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                      }`}
                    onClick={() => setSelectedAddress(address._id)}
                  >
                    <div className="flex items-start">
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 mt-1 ${selectedAddress === address._id
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-400'
                          }`}
                      >
                        {selectedAddress === address._id && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{address.addressLabel}</h3>
                        <p className="text-gray-600 text-sm">
                          {address.streetAdress}, {address.city}, {address.state} -{" "}
                          {address.postalCode}, {address.country}
                        </p>
                        {address.isDefault && (
                          <span className="text-xs text-green-600 font-medium">
                            Default Address
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>


              <button className="flex items-center text-green-600 font-medium"
                onClick={handleAddAddress}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Address
              </button>
            </div>

            {/* Contact Details Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={user?.phoneNumber}
                    disabled
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Time Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferred Delivery Time</h2>

              <div className="space-y-3">
                {deliveryOptions.map(option => (
                  <div
                    key={option.id}
                    className={`border rounded-md p-4 cursor-pointer transition-colors ${deliveryTime === option.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                    onClick={() => setDeliveryTime(option.id)}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${deliveryTime === option.id ? 'border-green-500 bg-green-500' : 'border-gray-400'}`}>
                        {deliveryTime === option.id && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <button className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                onClick={handlePayment}
              >
                Continue to Payment
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Add New Address"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="addressLabel"
            label="Address Label"
            rules={[{ required: true, message: 'Please enter an address label' }]}
          >
            <Input placeholder="e.g., Home, Office, etc." />
          </Form.Item>

          <Form.Item
            name="streetAdress"
            label="Street Address"
            rules={[{ required: true, message: 'Please enter street address' }]}
          >
            <TextArea rows={3} placeholder="Enter your complete street address" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter city' }]}
            >
              <Input placeholder="City" />
            </Form.Item>

            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: 'Please enter state' }]}
            >
              <Input placeholder="State" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="postalCode"
              label="Postal Code"
              rules={[{ required: true, message: 'Please enter postal code' }]}
            >
              <Input placeholder="Postal Code" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: 'Please enter country' }]}
            >
              <Input placeholder="Country" />
            </Form.Item>
          </div>

          <Form.Item
            name="isDefault"
            label="Set as Default Address"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <div className="flex justify-end space-x-3 pt-4">
            <Button onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              Add Address
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default Checkout;