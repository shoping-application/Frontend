import React, {  useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Divider, Modal} from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { signupUser } from "../../../redux/thunk/authThunk"
import { useDispatch } from 'react-redux';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const dispatch = useDispatch()

    const onFinish = async (values) => {
        setLoading(true);
        try {

            await dispatch(signupUser(values)).unwrap();
            toast.success("Account created successfully!");
            navigate("/login");

        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const PrivacyModal = () => (
        <Modal
            title="Privacy Policy"
            open={showPrivacyModal}
            onCancel={() => setShowPrivacyModal(false)}
            footer={[
                <Button key="close" type="primary" onClick={() => setShowPrivacyModal(false)}>
                    Close
                </Button>
            ]}
        >
            <p>
                Your privacy is important to us. This section would contain the actual privacy policy text explaining
                how we collect, use, and protect your personal information. By creating an account, you agree to our
                terms and conditions regarding data handling and privacy protection.
            </p>
            <p>
                We collect information that you provide directly to us, including your name, email address, and
                any other information you choose to provide. We use this information to operate and improve our services.
            </p>
        </Modal>
    );

    return (
        <div className="signup-container">
            <Card className="signup-card sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="signup-header">
                    <h1>Create an Account</h1>
                    <p className="subtitle">Start your grocery shopping journey with us</p>
                </div>

                <Form
                    form={form}
                    name="signup"
                    onFinish={onFinish}
                    layout="vertical"
                    className="signup-form"
                    requiredMark={false}
                >
                    <Form.Item
                        name="fullName"
                        label={
                            <span className='flex items-center gap-1'>
                                Full Name <span className="required-asterisk">*</span>
                            </span>
                        }
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                        <Input
                            //   prefix={<UserOutlined />} 
                            placeholder="John Doe"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={
                            <span className='flex items-center gap-1'>
                                Email Address <span className="required-asterisk">*</span>
                            </span>
                        }
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input
                            //   prefix={<MailOutlined />} 
                            placeholder="you@example.com"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        // label="Password"
                        label={
                            <span className='flex items-center gap-1'>
                                Password <span className="required-asterisk">*</span>
                            </span>
                        }
                        rules={[
                            { required: true, message: 'Please enter your password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            //   prefix={<LockOutlined />} 
                            placeholder="Create a password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label={
                            <span className='flex items-center gap-1'>
                                Confirm Password <span className="required-asterisk">*</span>
                            </span>
                        }
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            //   prefix={<LockOutlined />} 
                            placeholder="Confirm your password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions'))
                            }
                        ]}
                    >
                        <Checkbox>
                            I agree to the <span className="link" onClick={() => setShowPrivacyModal(true)}>Terms and Privacy Policy</span>
                        </Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            //   type="primary" 
                            htmlType="submit"
                            className="signup-button"
                            //   size="large"
                            loading={loading}
                            block
                        >
                            Create Account
                        </Button>
                    </Form.Item>
                </Form>

                <Divider>or</Divider>

                <Button
                    className="google-signin-btn"
                    size="large"
                    block
                    icon={<GoogleOutlined />}
                >
                    Continue with Google
                </Button>

                <div className="login-redirect">
                    Already have an account? <span className="signup-link-btn hover:underline cursor-pointer" onClick={() => navigate('/login')}>Log in</span>
                </div>
            </Card>

            <PrivacyModal />
        </div>
    );
};

export default Signup;