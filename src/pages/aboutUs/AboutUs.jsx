import React from 'react';
import { Row, Col, Card, Avatar, Space, Typography } from 'antd';
import {
    RocketOutlined,
    StarOutlined,
    CustomerServiceOutlined,
    TeamOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';

import {
    ThunderboltOutlined,
    SmileOutlined,
    SafetyOutlined,
} from "@ant-design/icons";

import Alex from "../../assets/Alex.png"
import Maria from "../../assets/Maria.png"
import David from "../../assets/David.png"
import Sophia from "../../assets/Sophia.png"
import Header from '../header/Header';

import OurMission from "../../assets/aboutUs.png"

const { Title, Paragraph, Text } = Typography;

const AboutUs = () => {
    // Team members data
    const teamMembers = [
        {
            name: 'Alex Johnson',
            role: 'Co-Founder & CEO',
            avatar: Alex
        },
        {
            name: 'Maria Garcia',
            role: 'Co-Founder & COO',
            avatar: Maria
        },
        {
            name: 'David Chen',
            role: 'Head of Technology',
            avatar: David
        },
        {
            name: 'Sophia Patel',
            role: 'Head of Operations',
            avatar: Sophia
        }
    ];


    const feature = [
        {
            icon: <ThunderboltOutlined style={{ fontSize: 20, color: "#fff" }} />,
            bg: "bg-green-500",
            title: "Lightning–Fast Delivery",
            desc: "Our optimized logistics network means you get what you need, when you need it. No more waiting.",
        },
        {
            icon: <SafetyOutlined style={{ fontSize: 20, color: "#fff" }} />,
            bg: "bg-green-500",
            title: "Quality & Freshness",
            desc: "We are committed to providing the freshest produce and highest quality products available.",
        },
        {
            icon: <SmileOutlined style={{ fontSize: 20, color: "#fff" }} />,
            bg: "bg-green-500",
            title: "Customer–Centric Service",
            desc: "Your satisfaction is our priority. Our support team is always ready to help with a smile.",
        },
    ];

    return (

        <div>

            <Header />
            <div className='bg-green-50' style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
                {/* Hero Section */}
                <section style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Title level={3} style={{ color: '#16a34a', marginBottom: '0px' }}>
                        OUR STORY
                    </Title>
                    <Title level={2} style={{ fontWeight: 'normal' }}>
                        From a Simple Idea to Your Daily Convenience
                    </Title>
                    <Paragraph style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto' }}>
                        SwiftMart was born from a desire to make grocery shopping effortless. We believed that getting fresh,
                        high-quality groceries shouldn't be a chore. It should be a seamless experience that gives you back
                        your most valuable asset: time.
                    </Paragraph>
                </section>

                <div style={{ borderTop: '1px solid #e8e8e8', margin: '40px 0' }} />

                {/* Mission Section */}
                {/* <section style={{ padding: '40px 0' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
                        Our Mission: Freshness at Your Fingertips
                    </Title>
                    <Paragraph style={{ fontSize: '16px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
                        Our mission is simple: to deliver the freshest groceries and household essentials to your doorstep in minutes.
                        We partner with local farmers and trusted suppliers to bring you the best products, all while ensuring a
                        sustainable and efficient delivery process.
                    </Paragraph>

                    <Row gutter={[24, 24]} justify="center">
                        {features.map((feature, index) => (
                            <Col xs={24} md={8} key={index}>
                                <Card
                                    style={{ textAlign: 'center', height: '100%', borderRadius: '8px' }}
                                    bordered={false}
                                    hoverable
                                >
                                    <div style={{ fontSize: '36px', color: '#16a34a', marginBottom: '16px' }}>
                                        {feature.icon}
                                    </div>
                                    <Title level={4}>{feature.title}</Title>
                                    <Paragraph>{feature.description}</Paragraph>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section> */}

                <div className="max-w-7xl mx-auto px-6 py-16">
                    <Row gutter={[48, 24]} align="middle">
                        {/* Left Content */}
                        <Col xs={24} md={12}>
                            <Title level={2} className="!mb-4">
                                Our Mission: <br /> Freshness at Your Fingertips
                            </Title>
                            <Paragraph className="text-gray-600 !mb-8 text-lg leading-relaxed">
                                Our mission is simple: to deliver the freshest groceries and
                                household essentials to your doorstep in minutes. We partner with
                                local farmers and trusted suppliers to bring you the best products,
                                all while ensuring a sustainable and efficient delivery process.
                            </Paragraph>

                            <Space direction="vertical" size="large" className="w-full">
                                {feature.map((item, idx) => (
                                    <div key={idx} className="flex items-start space-x-4">
                                        <div
                                            className={`${item.bg} w-10 h-10 flex items-center justify-center rounded-lg shadow`}
                                        >
                                            {item.icon}
                                        </div>
                                        <div>
                                            <Text strong className="block text-base mb-1">
                                                {item.title}
                                            </Text>
                                            <Paragraph className="!mb-0 text-gray-600">
                                                {item.desc}
                                            </Paragraph>
                                        </div>
                                    </div>
                                ))}
                            </Space>
                        </Col>

                        {/* Right Image */}
                        <Col xs={24} md={12}>
                            <img
                                src={OurMission}
                                alt="Fresh groceries"
                                className="rounded-2xl shadow-lg w-full object-cover"
                            />
                        </Col>
                    </Row>
                </div>

                <div style={{ borderTop: '1px solid #e8e8e8', margin: '40px 0' }} />

                {/* Team Section */}
                <section style={{ padding: '40px 0' }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
                        Meet the Team
                    </Title>
                    <Paragraph style={{ textAlign: 'center', fontSize: '16px', marginBottom: '30px' }}>
                        The passionate people behind SwiftMart, dedicated to revolutionizing your grocery experience.
                    </Paragraph>

                    <Row gutter={[24, 24]} justify="center">
                        {teamMembers.map((member, index) => (
                            <Col xs={12} md={6} key={index}>
                                <Card
                                    style={{ textAlign: 'center', borderRadius: '8px' }}
                                    bordered={false}
                                    hoverable
                                >
                                    <Avatar
                                        src={member.avatar}
                                        size={80}
                                        style={{ backgroundColor: '#16a34a', marginBottom: '16px' }}
                                    >

                                    </Avatar>
                                    <Title level={4} style={{ marginBottom: '4px' }}>{member.name}</Title>
                                    <Text type="secondary">{member.role}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                <div style={{ borderTop: '1px solid #e8e8e8', margin: '40px 0' }} />

                {/* CTA Section */}
                <section style={{
                    textAlign: 'center',
                    padding: '60px 0',
                    background: 'linear-gradient(135deg, #16a34a 0%, #e4efe9 100%)',
                    borderRadius: '8px',
                    margin: '40px 0'
                }}>
                    <Title level={2}>Ready to Reclaim Your Time?</Title>
                    <Paragraph style={{ fontSize: '16px', marginBottom: '30px' }}>
                        Join the SwiftMart family today and experience the future of grocery shopping.
                    </Paragraph>
                    <button
                        type="primary"
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        style={{ height: '50px', padding: '0 30px', borderRadius: '25px' }}
                        className="relative overflow-hidden border bg-white border-white text-green-700 rounded-full px-8 py-2 font-medium transition-colors duration-300 ease-in-out
             before:absolute before:top-0 before:left-0 before:h-full before:w-0 before:bg-green-700 before:transition-all before:duration-500 hover:before:w-full
             hover:text-white hover:border-green-700 "
                    >
                        <span className="relative z-10">Start Shopping Now</span>
                    </button>
                </section>


            </div>

            {/* Footer Section */}
            <footer style={{
                padding: '40px 50px',
                background: "black",
                color: "white",
                marginTop: '40px'
            }}>
                <div style={{ margin: '0 auto' }}>
                    <Row gutter={[40, 20]} align="top">
                        {/* Company Name and Tagline on the left */}
                        <Col xs={24} md={12}>
                            <div className="flex flex-col">
                                {/* Logo + Title in one row */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 text-green-600">
                                        <svg
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-full h-full"
                                        >
                                            <path
                                                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </div>
                                    <Title level={3} className="!text-white mb-0">
                                        SwiftMart
                                    </Title>
                                </div>

                                {/* Paragraph on next line */}
                                <Paragraph className="!text-white opacity-80 mt-0 mb-0">
                                    Your daily essentials, delivered in minutes.
                                </Paragraph>
                            </div>
                        </Col>

                        {/* Navigation links on the right */}
                        <Col xs={24} md={12}>
                            <Row gutter={[40, 20]}>
                                <Col xs={8} sm={8}>
                                    <Title level={5} className="!text-white mb-4">COMPANY</Title>
                                    <div className="flex flex-col gap-2">
                                        <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">About</div>
                                        <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Careers</div>
                                    </div>
                                </Col>

                                <Col xs={8} sm={8}>
                                    <Title level={5} className="!text-white mb-4">SUPPORT</Title>
                                    <div className="flex flex-col gap-2">
                                        <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Help Center</div>
                                        <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Contact Us</div>
                                        <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Terms of Service</div>
                                    </div>
                                </Col>

                                <Col xs={8} sm={8}>
                                    <Title level={5} className="!text-white mb-4">LEGAL</Title>
                                    <div className="flex flex-col gap-2">
                                        <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Privacy Policy</div>
                                        <div className="opacity-70 cursor-pointer transition hover:!text-white hover:opacity-100">Cookie Policy</div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Copyright notice */}
                    <div style={{
                        marginTop: '40px',
                        color: '#999',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        textAlign: 'center'
                    }}>
                        © 2024 SwiftMart, Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;