import React from "react";
import { Button, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/slice/authSlice";

import { useDispatch } from 'react-redux';

const { Title, Text } = Typography;

const Logout = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate()
    const handleOk = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/login")
        dispatch(logout())
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "40px 32px",
                    borderRadius: "12px",
                    maxWidth: "400px",
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                {/* Emoji */}
                {/* <div style={{ fontSize: "48px" }}>😢</div> */}
                <motion.div
                    style={{ fontSize: "48px", display: "inline-block" }}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                >
                    😢
                </motion.div>

                <Title level={4} style={{ margin: "16px 0 8px", color: "#262626" }}>
                    Oh no, you're leaving...
                </Title>

                <Text type="secondary" style={{ fontSize: "16px" }}>
                    Are you sure you want to log out?
                </Text>

                <Button
                    type="primary"
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleOk}
                    size="large"
                    block
                    style={{ height: "40px", fontWeight: 600, marginTop: "24px" }}
                >
                    Log Out
                </Button>
            </div>
        </div>
    );
};

export default Logout;
