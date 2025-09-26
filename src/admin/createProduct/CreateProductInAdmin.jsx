import React, { useState } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    Button,
    Upload,
    message,
    Card,
    Row,
    Col
} from 'antd';
import {
    UploadOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import {createProduct} from "../../../redux/thunk/productThunk"

const { TextArea } = Input;
const { Option } = Select;

const CreateProductInAdmin = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch()

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", "my_unsigned_preset"); // replace with your preset name

        try {
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/dwobwilcy/image/upload", // your real cloud_name here
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            console.log("Cloudinary response:", data);

            if (!data.secure_url) {
                throw new Error("Failed to upload image to Cloudinary");
            }

            return {
                url: data.secure_url,
                altText: file.name || "Product image",
                isPrimary: false,
            };
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw new Error("Image upload failed");
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            let imageUrls = [];

            if (values.images && values.images.length > 0) {
                setUploading(true);
                message.info("Uploading images...");

                for (let i = 0; i < values.images.length; i++) {
                    const file = values.images[i].originFileObj;
                    if (file) {
                        const uploadedImage = await uploadImageToCloudinary(file);
                        if (i === 0) uploadedImage.isPrimary = true;
                        imageUrls.push(uploadedImage);
                    }
                }
                setUploading(false);
            }

            const productData = {
                ...values,
                images: imageUrls,
                salesCount: 0,
                ratings: {
                    average: 0,
                    count: 0,
                    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                },
            };

            console.log("Product data ready to send:", productData);

            dispatch(createProduct(productData))
            message.success("Product created successfully!");
            // form.resetFields();
        } catch (error) {
            console.error("Error creating product:", error);
            message.error(error.message || "Failed to create product. Please try again.");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // Custom upload props to prevent automatic upload
    const uploadProps = {
        beforeUpload: () => false, // Prevent automatic upload
        listType: "picture",
        multiple: true,
        accept: "image/*",
        maxCount: 5, // Limit number of images
    };

    return (
        <Card
            title="Create New Product"
            className="!bg-green-50 bg-opacity-5 border border-white border-opacity-10 rounded-lg"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    organic: false,
                    status: 'draft',
                    weight: { unit: 'g' }
                }}
            >
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="name"
                            label="Product Name"
                            rules={[{ required: true, message: 'Please enter product name' }]}
                        >
                            <Input placeholder="e.g., Organic Apples" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
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
                    rules={[{ required: true, message: 'Please enter product description' }]}
                >
                    <TextArea rows={3} placeholder="Product description..." />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            name="price"
                            label="Price ($)"
                            rules={[{ required: true, message: 'Please enter price' }]}
                        >
                            <InputNumber
                                min={0}
                                step={0.01}
                                className="w-full"
                                placeholder="0.00"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            name="brand"
                            label="Brand"
                        >
                            <Input placeholder="Brand name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            name="organic"
                            label="Organic"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name={['weight', 'value']}
                            label="Weight Value"
                        >
                            <InputNumber
                                min={0}
                                className="w-full"
                                placeholder="Weight value"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name={['weight', 'unit']}
                            label="Weight Unit"
                        >
                            <Select>
                                <Option value="g">g</Option>
                                <Option value="kg">kg</Option>
                                <Option value="lb">lb</Option>
                                <Option value="oz">oz</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="status"
                    label="Status"
                >
                    <Select>
                        <Option value="draft">Draft</Option>
                        <Option value="active">Active</Option>
                        <Option value="archived">Archived</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="images"
                    label="Product Images"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[
                        {
                            validator: (_, value) => {
                                if (value && value.length > 5) {
                                    return Promise.reject(new Error('You can only upload up to 5 images'));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Upload Images (Max 5)</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading || uploading}
                        icon={<SaveOutlined />}
                        size="large"
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading Images...' : 'Create Product'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CreateProductInAdmin;