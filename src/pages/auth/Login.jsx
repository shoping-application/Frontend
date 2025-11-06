import { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Divider } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';
import { useDispatch } from 'react-redux';
import { loginUser } from "../../../redux/thunk/authThunk"
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../../../config/apiConfig';
import {setUser,setAuthenticated , setAccessToken} from '../../../redux/slice/authSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await dispatch(loginUser(values)).unwrap();
      toast.success("Login successfully!");
      navigate("/home");

    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    try {
      if (response["code"]) {
        const res = await api.post(
          `${BASE_URL}/api/user/google-signup`,
          {
            code: response["code"],
          }
        );

        if (res?.data?.success) {
          if (res?.data?.success === true) {
            console.log("Google Sign-In Response:", res?.data);

             dispatch(setUser(res?.data?.user));
             dispatch(setAuthenticated(true));
             dispatch(setAccessToken(res?.data?.token));
            form.resetFields();
            navigate("/home");
            toast.success("Login Successful");
          }
        } else {
          toast.error("Sign-In Failed");
        }
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Sign-In Failed");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: handleGoogleResponse,
    flow: "auth-code",
  });



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

          {/* <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" className="remember-me">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="forgot-password-link" href="/forgot-password">
              Forgot your password?
            </a>
          </div> */}


          <div className="login-options-aligned mb-5">
            <Form.Item name="remember" valuePropName="checked" className="remember-me">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Link to="/forgot-password" className="forgot-password-link">
              Forgot your password?
            </Link>
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
          onClick={handleGoogleSignin}
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