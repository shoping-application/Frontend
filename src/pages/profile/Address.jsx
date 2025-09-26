import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Typography, Divider, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import countryList from "react-select-country-list";
import { useDispatch, useSelector } from 'react-redux';

import { createAddress, getAddress, deleteAddress, setDefaultAddress, updateAddress } from "../../../redux/thunk/addressThunk"
const { Title, Text } = Typography;

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Address = () => {
    const [loading, setLoading] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const dispatch = useDispatch()

    const addresses = useSelector((state) => state?.address?.address)



    useEffect(() => {
        dispatch(getAddress())
    }, [dispatch])

    const [form] = Form.useForm();

    const countryOptions = countryList().getData();


    const handleSubmit = (values) => {
        setLoading(true);

        console.log("editingAddress editingAddress",editingAddress);
        

        if (editingAddress) {
            // 🔄 Update existing
            dispatch(updateAddress({ id: editingAddress, data: values }))
                .unwrap()
                .then(() => {
                    toast.success("Address updated successfully");
                    form.resetFields();
                    setEditingAddress(null); // exit edit mode
                    dispatch(getAddress());
                })
                .catch((error) => toast.error(error || "Failed to update"))
                .finally(() => setLoading(false));
        } else {
            // ➕ Create new
            dispatch(createAddress(values))
                .unwrap()
                .then(() => {
                    toast.success("Address created successfully");
                    form.resetFields();
                    dispatch(getAddress());
                })
                .catch((error) => toast.error(error || "Failed to create"))
                .finally(() => setLoading(false));
        }
    };


    const handleDelete = (id) => {
        console.log("id id id", id)
        dispatch(deleteAddress(id))
            .unwrap()
            .then(() => {
                toast.success("Address deleted"); dispatch(getAddress());
            })
            .catch((err) => toast.error(err));
    };


    
    const handleDefault = (id) => {
        console.log("id id id", id)
        dispatch(setDefaultAddress(id))
            .unwrap()
            .then(() => {
                toast.success("Default address changed"); dispatch(getAddress());
            })
            .catch((err) => toast.error(err));
    };

    const handleEdit = (addr) => {
        setEditingAddress(addr._id);
        form.setFieldsValue(addr);
    };

    return (
        <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto">
            <Title level={2} className="mb-2">Manage Addresses</Title>
            <Text type="secondary" className="text-base">Add, edit, or remove your delivery addresses.</Text>

            <Divider className="my-6" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Saved Addresses */}
                <div>
                    <Title level={4} className="mb-4">Saved Addresses</Title>
                    <div className="space-y-4">
                        {addresses && addresses.length > 0 ? (
                            addresses.map((addr) => (
                                <div key={addr._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <Text strong className="text-base">{addr.addressLabel}</Text>
                                            {addr.isDefault && (
                                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined className="text-gray-600" />}
                                                className="p-1 h-auto"
                                                onClick={() => handleEdit(addr)}
                                            />
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined className="text-gray-600" />}
                                                className="p-1 h-auto"
                                                onClick={() => handleDelete(addr._id)}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-gray-700 mb-3">
                                        {addr.streetAdress}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}
                                    </div>

                                    {!addr.isDefault && (
                                        <button
                                            type="link"
                                            onClick={() => handleDefault(addr._id)}
                                            className="text-green-600 p-0 h-auto hover:underline font-normal text-sm"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center border border-dashed border-gray-300 rounded-lg p-8">
                                <div className="mb-4">
                                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <Text className="text-gray-500 text-lg font-medium mb-2 block">
                                    No addresses saved yet
                                </Text>
                                <Text className="text-gray-400 mb-4 block">
                                    Add your first address to make checkout faster
                                </Text>

                            </div>
                        )}
                    </div>
                </div>

                {/* Add New Address Form */}
                <div>
                    <Title level={4} className="mb-4">Add a New Address</Title>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                        className="mt-2"
                        requiredMark={false}
                    >
                        <Form.Item
                            label="Address Label (e.g. Home, Work)"
                            name="addressLabel"
                            rules={[{ required: true, message: "Please enter a label" }]}
                        >
                            <Input placeholder="Home" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Street Address"
                            name="streetAdress"
                            rules={[{ required: true, message: "Please enter the street address" }]}
                        >
                            <Input placeholder="123 Maple Street" size="large" />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[{ required: true, message: "Please enter city" }]}
                            >
                                <Input placeholder="Springfield" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="State"
                                name="state"
                                rules={[{ required: true, message: "Please enter state" }]}
                            >
                                <Input placeholder="IL" size="large" />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <Form.Item
                                label="Zip Code"
                                name="postalCode"
                                rules={[{ required: true, message: "Please enter zip code" }]}
                            >
                                <Input placeholder="62704" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Country"
                                name="country"
                                rules={[{ required: true, message: "Please select a country" }]}
                            >
                                <Select
                                    placeholder="Select a country"
                                    size="large"
                                    showSearch
                                    optionFilterProp="children"
                                >
                                    {countryOptions.map((c) => (
                                        <Option key={c.value} value={c.label}>
                                            {c.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                        </div>

                        <Form.Item name="isDefault" valuePropName="checked">
                            <Checkbox>Set as default address</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <div className="flex justify-between items-center w-full">
                                <Button
                                    type="primary"
                                    loading={loading}
                                    htmlType="submit"
                                    className="bg-green-600 hover:bg-green-700 flex items-center"
                                    size="large"
                                    icon={editingAddress ? <EditOutlined /> : <PlusOutlined />}
                                >
                                    {editingAddress ? "Update Address" : "Add Address"}
                                </Button>

                                {editingAddress && (
                                    <Button
                                        type="default"
                                        className="ml-2"
                                        onClick={() => {
                                            form.resetFields();
                                            setEditingAddress(null); // cancel edit mode
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </Form.Item>

                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Address;