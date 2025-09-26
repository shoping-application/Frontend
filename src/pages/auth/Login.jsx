import { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Divider } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { useDispatch } from 'react-redux';
import { loginUser } from "../../../redux/thunk/authThunk"

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()

  const onFinish = async (values) => {
    setLoading(true);
    try {
      dispatch(loginUser(values)).unwrap();
      toast.success("Login successfully!");
      navigate("/home");

    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <Card className="login-card sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="signup-header">
          <h1>Sign in to your account</h1>
          <p className="subtitle">Or start your 14-day free trial</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          className="login-form"
          requiredMark={false}
        >
          <Form.Item
            name="email"
            label={
              <span className='flex items-center gap-1 text-gray-800'>
                Email Address <span className="required-asterisk">*</span>
              </span>
            }
            rules={[{ required: true, message: 'Please enter your email or username' }]}
          >
            <Input
              //   prefix={<MailOutlined />} 
              placeholder="you@example.com or username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span className='flex items-center gap-1 text-gray-800'>
                Password <span className="required-asterisk">*</span>
              </span>
            }
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              //   prefix={<LockOutlined />} 
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" className="remember-me">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="forgot-password-link" href="/forgot-password">
              Forgot your password?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="signup-button"
              size="large"
              loading={loading}
              block
            >
              Sign in
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

        <div className="signup-redirect">
          New to SwiftMart?
          <Button
            type="link"
            onClick={() => navigate('/')}
            className="signup-link-btn hover:underline"
          >
            Create an account
          </Button>
        </div>
      </Card>


    </div>
  );
};

export default Login;