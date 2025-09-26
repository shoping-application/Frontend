import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeOutlined, CheckOutlined } from '@ant-design/icons';
import { Input } from "antd"
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { resetPassword } from "../../../redux/thunk/authThunk"

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
        token: token
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'newPassword') {
            setPasswordRequirements({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(resetPassword(formData))
            .unwrap() // works if you're using createAsyncThunk
            .then(() => {
                toast.success("✅ Password changed successfully!");
                navigate("/login");
            })
            .catch((err) => {
                toast.error(`❌ ${err || "Failed to reset password"}`);
            });
    };

    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
    const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword !== '';

    return (
        <div
            className="min-h-screen login-container bg-green-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">


            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-6 shadow-sm rounded-lg sm:px-10 border border-gray-200">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-9">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h1>
                            <p className="text-gray-600">Create a new, secure password for your account.</p>
                        </div>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* New Password Field */}
                        <div>
                            <label htmlFor="newPassword" className="block text-base font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeInvisibleOutlined className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeOutlined className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>

                            {/* Password Requirements */}
                            <div className="mt-3 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements.length ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                        {passwordRequirements.length && <CheckOutlined className="text-white text-xs" />}
                                    </div>
                                    <span className={`text-sm ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                                        Must be at least 8 characters long
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements.uppercase ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                        {passwordRequirements.uppercase && <CheckOutlined className="text-white text-xs" />}
                                    </div>
                                    <span className={`text-sm ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        Contains uppercase letter
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements.lowercase ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                        {passwordRequirements.lowercase && <CheckOutlined className="text-white text-xs" />}
                                    </div>
                                    <span className={`text-sm ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        Contains lowercase letter
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements.number ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                        {passwordRequirements.number && <CheckOutlined className="text-white text-xs" />}
                                    </div>
                                    <span className={`text-sm ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                                        Contains number
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordRequirements.specialChar ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                        {passwordRequirements.specialChar && <CheckOutlined className="text-white text-xs" />}
                                    </div>
                                    <span className={`text-sm ${passwordRequirements.specialChar ? 'text-green-600' : 'text-gray-500'}`}>
                                        Contains special character
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Confirm New Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-greay-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeInvisibleOutlined className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeOutlined className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {formData.confirmPassword && (
                                <div className="mt-2 flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'
                                        }`}>
                                        {passwordsMatch ? <CheckOutlined className="text-white text-xs" /> : '!'}
                                    </div>
                                    <span className={`text-sm ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <hr className="border-gray-300" />
                        </div>

                        {/* Reset Password Button */}
                        <button
                            type="submit"
                            disabled={!allRequirementsMet || !passwordsMatch}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors 
                                    ${!allRequirementsMet || !passwordsMatch
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'signup-button'}`}
                        >
                            Reset Password
                        </button>

                        {/* Sign In Link */}
                        <div className="text-center pt-4">
                            <p className="text-gray-600 text-sm">
                                Remember your password?{' '}
                                <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;