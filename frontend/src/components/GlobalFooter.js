'use client';

import { Layout, Typography, Row, Col, Space, Divider } from 'antd';
import { TwitterOutlined, FacebookOutlined, InstagramOutlined, LinkedinOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Footer } = Layout;
const { Title, Text } = Typography;

export default function GlobalFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <Footer className="bg-gray-900 pt-16 pb-8 px-6 md:px-12 mt-auto">
            <div className="max-w-7xl mx-auto">
                <Row gutter={[48, 32]} className="mb-12">
                    {/* Brand & Description */}
                    <Col xs={24} md={8}>
                        <Title level={3} className="text-brand-500 m-0 mb-4 tracking-tight">
                            Smart<span className="text-white">Park</span>
                        </Title>
                        <Text className="text-gray-400 block mb-6 leading-relaxed">
                            Revolutionizing urban mobility by connecting drivers with secure, convenient, and affordable parking spaces. Book instantly or monetize your unused driveway today.
                        </Text>
                        <Space size="middle">
                            <a href="#" className="text-gray-400 hover:text-brand-400 transition-colors">
                                <TwitterOutlined className="text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <FacebookOutlined className="text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                                <InstagramOutlined className="text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <LinkedinOutlined className="text-xl" />
                            </a>
                        </Space>
                    </Col>

                    {/* Quick Links */}
                    <Col xs={24} sm={12} md={5}>
                        <Title level={5} className="text-white mb-6 uppercase tracking-wider text-sm font-semibold">Quick Links</Title>
                        <div className="flex flex-col gap-3">
                            <Link href="/" className="text-gray-400 hover:text-brand-400 transition-colors">Home</Link>
                            <Link href="/search" className="text-gray-400 hover:text-brand-400 transition-colors">Find Parking</Link>
                            <Link href="/about" className="text-gray-400 hover:text-brand-400 transition-colors">About Us</Link>
                            <Link href="/contact" className="text-gray-400 hover:text-brand-400 transition-colors">Contact Us</Link>
                        </div>
                    </Col>

                    {/* For Users */}
                    <Col xs={24} sm={12} md={5}>
                        <Title level={5} className="text-white mb-6 uppercase tracking-wider text-sm font-semibold">For Users</Title>
                        <div className="flex flex-col gap-3">
                            <Link href="/login" className="text-gray-400 hover:text-brand-400 transition-colors">Driver Login</Link>
                            <Link href="/login" className="text-gray-400 hover:text-brand-400 transition-colors">Owner Login</Link>
                            <Link href="/register" className="text-gray-400 hover:text-brand-400 transition-colors">Register Space</Link>
                            <Link href="/driver/dashboard" className="text-gray-400 hover:text-brand-400 transition-colors">Dashboard</Link>
                        </div>
                    </Col>

                    {/* Contact Info */}
                    <Col xs={24} md={6}>
                        <Title level={5} className="text-white mb-6 uppercase tracking-wider text-sm font-semibold">Contact Us</Title>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <EnvironmentOutlined className="text-brand-500 mt-1" />
                                <Text className="text-gray-400">123 Market Street<br />Kandy, Sri Lanka 20000</Text>
                            </div>
                            <div className="flex items-center gap-3">
                                <PhoneOutlined className="text-brand-500" />
                                <a href="tel:+940778880890" className="text-gray-400 hover:text-brand-400 transition-colors" suppressHydrationWarning>+94 (077) 888-0890</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <MailOutlined className="text-brand-500" />
                                <a href="mailto:support@smartpark.com" className="text-gray-400 hover:text-brand-400 transition-colors" suppressHydrationWarning>support@smartpark.com</a>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Divider className="border-gray-800" />

                <div className="flex flex-col md:flex-row justify-between items-center pt-2">
                    <Text className="text-gray-500 text-sm">
                        &copy; {currentYear} SmartPark Ltd. All rights reserved.
                    </Text>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
                        <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </Footer>
    );
}
