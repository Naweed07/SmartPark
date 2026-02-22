'use client';

import { Typography, Row, Col, Card } from 'antd';
import { SafetyCertificateOutlined, ThunderboltOutlined, TeamOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Title, Text, Paragraph } = Typography;

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-brand-50 py-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <Title level={1} className="text-brand-800 mb-6 text-4xl md:text-5xl font-extrabold">
                        About SmartPark
                    </Title>
                    <Text className="text-lg md:text-xl text-brand-600 block mb-8 leading-relaxed max-w-2xl mx-auto">
                        We are on a mission to completely eliminate parking stress from urban life while helping property owners monetize their unused spaces.
                    </Text>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-20 px-6 max-w-6xl mx-auto">
                <Row gutter={[48, 48]} className="items-center mb-24">
                    <Col xs={24} md={12}>
                        <Title level={2} className="text-gray-800 mb-6">Our Story</Title>
                        <Paragraph className="text-gray-600 text-lg leading-relaxed mb-4">
                            SmartPark was born out of frustration. Our founders spent thousands of hours circling city blocks looking for parking spaces, while countless driveways sat empty right next to them.
                        </Paragraph>
                        <Paragraph className="text-gray-600 text-lg leading-relaxed mb-4">
                            We realized there was a massive disconnect. Property owners had space they didn't need during the day, and drivers needed that exact space.
                        </Paragraph>
                        <Paragraph className="text-gray-600 text-lg leading-relaxed">
                            Today, SmartPark bridges that gap. Our platform seamlessly connects drivers needing a spot with owners who have one to spare, creating a smarter, greener, and more efficient urban ecosystem.
                        </Paragraph>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="bg-brand-100 rounded-2xl h-[400px] flex justify-center items-center shadow-inner relative overflow-hidden">
                            <div className="p-8 text-center text-brand-600 bg-brand-50 border border-brand-200 rounded-xl max-w-sm absolute right-12 bottom-12 shadow-lg animate-fade-in-up hover:scale-105 transition-transform">
                                <Title level={2} className="m-0 text-brand-700">10k+</Title>
                                <Text className="font-medium">Drivers Parked Successfully</Text>
                            </div>
                            <div className="p-6 text-center text-blue-600 bg-blue-50 border border-blue-200 rounded-xl max-w-sm absolute left-12 top-12 shadow-lg animate-fade-in-up hover:scale-105 transition-transform" style={{ animationDelay: '0.2s' }}>
                                <Title level={2} className="m-0 text-blue-700">$500k</Title>
                                <Text className="font-medium">Paid out to space owners</Text>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Core Values */}
                <div className="text-center mb-16">
                    <Title level={2}>Our Core Values</Title>
                </div>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={8}>
                        <Card className="h-full rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow bg-gray-50 text-center">
                            <SafetyCertificateOutlined className="text-5xl text-brand-500 mb-6" />
                            <Title level={4}>Trust & Security</Title>
                            <Paragraph className="text-gray-500">
                                Every booking is secure. We partner with reliable payment processors and verify owners to ensure your vehicle is always safe.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="h-full rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow bg-gray-50 text-center">
                            <ThunderboltOutlined className="text-5xl text-yellow-500 mb-6" />
                            <Title level={4}>Instant Convenience</Title>
                            <Paragraph className="text-gray-500">
                                No more guessing. Find, book, and pay for your spot in seconds. Arrive knowing exactly where you are going.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="h-full rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow bg-gray-50 text-center">
                            <TeamOutlined className="text-5xl text-blue-500 mb-6" />
                            <Title level={4}>Community First</Title>
                            <Paragraph className="text-gray-500">
                                SmartPark isn't just an app; it's a community. Drivers get affordable parking while locals earn passive income.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
