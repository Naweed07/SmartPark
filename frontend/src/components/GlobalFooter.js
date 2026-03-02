'use client';

import { Layout, Typography, Row, Col, Space, Divider } from 'antd';
import { TwitterOutlined, FacebookOutlined, InstagramOutlined, LinkedinOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Footer } = Layout;
const { Title, Text } = Typography;

export default function GlobalFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <Footer className="bg-[#f8fafc] px-6 md:px-12 mt-auto border-t border-[#1363DF]/20">
            <div className="max-w-7xl mx-auto pt-8 pb-16 ">
                <Row gutter={[48, 32]} className="mb-12">
                    {/* Brand & Description */}
                    <Col xs={24} md={8}>
                        <div className="mb-6 inline-block px-4 py-3 rounded-2xl shadow-sm cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <img src="/logo.png" alt="SmartPark Logo" className="h-10 w-auto object-contain" />
                        </div>
                        <p className="text-[#0a1f44] block mb-6 leading-relaxed max-w-sm">
                            Revolutionizing urban mobility by connecting drivers with secure, convenient, and affordable parking spaces. Book instantly or monetize your unused driveway today.
                        </p>
                        <Space size="large" className="mt-2">
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#0a1f44] hover:bg-[#1363DF] hover:text-white transition-all shadow-sm">
                                <TwitterOutlined className="text-lg" />
                            </a>
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#0a1f44] hover:bg-[#1363DF] hover:text-white transition-all shadow-sm">
                                <FacebookOutlined className="text-lg" />
                            </a>
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#0a1f44] hover:bg-[#1363DF] hover:text-white transition-all shadow-sm">
                                <InstagramOutlined className="text-lg" />
                            </a>
                            <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-[#0a1f44] hover:bg-[#1363DF] hover:text-white transition-all shadow-sm">
                                <LinkedinOutlined className="text-lg" />
                            </a>
                        </Space>
                    </Col>

                    {/* Quick Links */}
                    <Col xs={24} sm={12} md={5}>
                        <Title level={5} className="text-[#0a1f44] mb-6 uppercase tracking-wider text-sm font-bold txt-dark-blue">Quick Links</Title>
                        <div className="flex flex-col gap-4">
                            <Link href="/" className="text-[#0a1f44] hover:text-[#1363DF] hover:translate-x-1 transition-all inline-block w-fit opacity-80 hover:opacity-100">Home</Link>
                            <Link href="/search" className="text-[#0a1f44] hover:text-[#1363DF] hover:translate-x-1 transition-all inline-block w-fit opacity-80 hover:opacity-100">Find Parking</Link>
                            <Link href="/about" className="text-[#0a1f44] hover:text-[#1363DF] hover:translate-x-1 transition-all inline-block w-fit opacity-80 hover:opacity-100">About Us</Link>
                            <Link href="/contact" className="text-[#0a1f44] hover:text-[#1363DF] hover:translate-x-1 transition-all inline-block w-fit opacity-80 hover:opacity-100">Contact Us</Link>
                        </div>
                    </Col>

                    {/* For Users */}
                    <Col xs={24} sm={12} md={5}>
                        <Title level={5} className="text-[#0a1f44] mb-6 uppercase tracking-wider text-sm font-bold txt-dark-blue">For Users</Title>
                        <div className="flex flex-col gap-4">
                            <Link href="/login" className="text-[#0a1f44] hover:text-[#1363DF] hover:translate-x-1 transition-all inline-block w-fit opacity-80 hover:opacity-100">Driver Login</Link>
                            <Link href="/login" className="text-[#0a1f44] hover:text-[#1363DF] hover:translate-x-1 transition-all inline-block w-fit opacity-80 hover:opacity-100">Owner Login</Link>
                            <Link href="/register" className="text-[#0a1f44] hover:text-[#1363DF] hover:translate-x-1 transition-all inline-block w-fit opacity-80 hover:opacity-100">Register Space</Link>
                            <Link href="/driver/dashboard" className="text-[#0a1f44] hover:text-[#1363DF] hover:translate-x-1 transition-all inline-block w-fit opacity-80 hover:opacity-100">Dashboard</Link>
                        </div>
                    </Col>

                    {/* Contact Info */}
                    <Col xs={24} md={6}>
                        <Title level={5} className="text-[#0a1f44] mb-6 uppercase tracking-wider text-sm font-bold txt-dark-blue">Contact Us </Title>
                        <div className="flex flex-col gap-5">
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#1363DF] transition-colors">
                                    <EnvironmentOutlined className="text-[#1363DF] group-hover:text-white text-lg transition-colors" />
                                </div>
                                <span className="text-[#0a1f44] opacity-80 leading-relaxed mt-2 text-sm font-medium">123 Market Street<br />Kandy, Sri Lanka 20000</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#1363DF] transition-colors">
                                    <PhoneOutlined className="text-[#1363DF] group-hover:text-white text-lg transition-colors" />
                                </div>
                                <a href="tel:+940778880890" className="text-[#0a1f44] opacity-80 hover:opacity-100 hover:text-[#1363DF] transition-colors text-sm font-medium tracking-wide" suppressHydrationWarning>+94 (077) 888-0890</a>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#1363DF] transition-colors">
                                    <MailOutlined className="text-[#1363DF] group-hover:text-white text-lg transition-colors" />
                                </div>
                                <a href="mailto:support@smartpark.com" className="text-[#0a1f44] opacity-80 hover:opacity-100 hover:text-[#1363DF] transition-colors text-sm font-medium tracking-wide" suppressHydrationWarning>support@smartpark.com</a>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Divider className="border-slate-200" />

                <div className="flex flex-col md:flex-row justify-between items-center py-4">
                    <p className="text-[#0a1f44] opacity-80 font-medium text-sm m-0">
                        &copy; {currentYear} SmartPark Ltd. All rights reserved.
                    </p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                        <a href="#" className="text-[#0a1f44] opacity-80 hover:opacity-100 hover:text-[#1363DF] text-sm font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-[#1363DF] hover:after:w-full after:transition-all">Privacy Policy</a>
                        <a href="#" className="text-[#0a1f44] opacity-80 hover:opacity-100 hover:text-[#1363DF] text-sm font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-[#1363DF] hover:after:w-full after:transition-all">Terms of Service</a>
                        <a href="#" className="text-[#0a1f44] opacity-80 hover:opacity-100 hover:text-[#1363DF] text-sm font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-[#1363DF] hover:after:w-full after:transition-all">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </Footer>
    );
}
