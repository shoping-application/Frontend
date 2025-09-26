import React, { useState } from 'react';
import { Form, Input, Button, Card, Divider, Typography, Alert, Space } from 'antd';
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPassword } from "../../../redux/thunk/authThunk"

const { Title, Text, Paragraph } = Typography;

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [form] = Form.useForm();
    const Navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()


    const handleSubmit = (values) => {
        setLoading(true);
        try {
            dispatch(forgotPassword(values)).unwrap();
            toast.success("Login successfully!");
            // Navigate("/home");
            setSubmitted(true)

        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleValidationFailed = (errorInfo) => {
        console.log('Validation Failed:', errorInfo);
    };

    return (
        <div className='login-container'>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 440,
                    borderRadius: 12,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
                bodyStyle={{ padding: 32 }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={2} style={{ color: '#262626', marginBottom: 8 }}>
                        Forgot your password?
                    </Title>
                    <Text className="text-base text-gray-600">
                        No worries, {submitted ? "we've" : "we'll"} send you reset instructions.
                    </Text>

                </div>

                <Divider />

                {!submitted ? (
                    <Form
                        form={form}
                        name="forgotPassword"
                        onFinish={handleSubmit}
                        onFinishFailed={handleValidationFailed}
                        layout="vertical"
                        requiredMark={false}
                    // size="large"
                    >
                        <Form.Item
                            label={
                                <span className='flex text-base items-center gap-1 text-gray-800'>
                                    Email Address <span className="required-asterisk">*</span>
                                </span>
                            }
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email address' },
                                { type: 'email', message: 'Please enter a valid email address' }
                            ]}

                        >
                            <Input
                                // prefix={<style={{ color: '#bfbfbf' }} />} 
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%', backgroundColor: '#389e0d', borderColor: '#389e0d' }}
                                size="large"
                                className='signup-button'
                                loading={loading}
                            >
                                Send Reset Link
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                        <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                        <Title level={3} style={{ marginBottom: 8, color: '#262626' }}>
                            Check your email!
                        </Title>
                        <Paragraph type="secondary" className='text-base text-gray-500'>
                            We've sent password reset instructions to <strong className='text-gray-700'>{email}</strong>
                        </Paragraph>
                        <Alert
                            message="Didn't receive the email?"
                            description={
                                <span>
                                    Check your spam folder or{' '}
                                    <a
                                        href="/forgot-password"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSubmitted(false);
                                        }}
                                        style={{ color: '#389e0d' }}
                                    >
                                        try again
                                    </a>
                                </span>
                            }
                            type="info"
                            showIcon
                        />
                    </Space>
                )}

                <Divider />

                <div style={{ textAlign: 'center' }}>
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        style={{ color: '#389e0d' }}
                        onClick={() => Navigate("/login")}
                    >
                        Back to Login
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;