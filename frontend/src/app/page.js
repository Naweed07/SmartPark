'use client';

import { Button, Row, Col, Card, Typography } from 'antd';
import Link from 'next/link';
import { SearchOutlined, EnvironmentOutlined, SafetyCertificateOutlined, DollarOutlined, ClockCircleOutlined, CarOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 overflow-hidden">
            {/* Hero Section */}
            <div className="w-full bg-white px-6 py-24 md:py-32 text-center relative">
                {/* Decorative background shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute top-12 -right-24 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    <Title level={1} className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Find Parking, <span className="text-brand-500">Instantly</span>
                    </Title>
                    <Paragraph className="text-xl md:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
                        SmartPark connects drivers with unused parking spaces. Reserve a spot in seconds, or list your own driveway and start earning today.
                    </Paragraph>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
                        <Link href="/search">
                            <Button
                                type="primary"
                                size="large"
                                icon={<SearchOutlined />}
                                className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-brand-500/30 hover:-translate-y-1 transition-transform"
                            >
                                Find a Spot
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                size="large"
                                icon={<EnvironmentOutlined />}
                                className="h-14 px-8 text-lg font-semibold rounded-full border-2 border-brand-500 text-brand-600 bg-white hover:bg-brand-50 hover:text-brand-700 transition-colors"
                            >
                                List Your Space
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <Title level={2} className="text-4xl text-gray-800">How It Works</Title>
                    <Text className="text-lg text-gray-500">Three simple steps to seamless parking</Text>
                </div>

                <Row gutter={[48, 48]} className="relative">
                    {/* Connecting dashed line for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-gray-200 z-0"></div>

                    <Col xs={24} md={8} className="relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-sm">1</div>
                            <Title level={4}>Search</Title>
                            <Paragraph className="text-gray-500 max-w-xs">
                                Enter your destination and date to find available parking spots nearby in real-time.
                            </Paragraph>
                        </div>
                    </Col>
                    <Col xs={24} md={8} className="relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-sm">2</div>
                            <Title level={4}>Book</Title>
                            <Paragraph className="text-gray-500 max-w-xs">
                                Review prices, select your duration, and securely pay online to guarantee your space.
                            </Paragraph>
                        </div>
                    </Col>
                    <Col xs={24} md={8} className="relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-sm">3</div>
                            <Title level={4}>Park</Title>
                            <Paragraph className="text-gray-500 max-w-xs">
                                Follow the directions to your reserved spot and park completely stress-free.
                            </Paragraph>
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Features Section */}
            <div className="py-24 px-6 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Title level={2} className="text-4xl text-gray-800">Why Choose SmartPark?</Title>
                    </div>

                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow bg-gray-50 rounded-2xl p-2">
                                <DollarOutlined className="text-4xl text-green-500 mb-4 block" />
                                <Title level={4} className="mb-2">Cost Effective</Title>
                                <Paragraph className="text-gray-500 m-0">Up to 50% cheaper than traditional commercial parking garages.</Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow bg-gray-50 rounded-2xl p-2">
                                <ClockCircleOutlined className="text-4xl text-blue-500 mb-4 block" />
                                <Title level={4} className="mb-2">Save Time</Title>
                                <Paragraph className="text-gray-500 m-0">Stop circling the block. Know exactly where you'll park before you leave.</Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow bg-gray-50 rounded-2xl p-2">
                                <SafetyCertificateOutlined className="text-4xl text-brand-500 mb-4 block" />
                                <Title level={4} className="mb-2">Secure & Verified</Title>
                                <Paragraph className="text-gray-500 m-0">All space owners are verified, and your payments are 100% secure.</Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow bg-gray-50 rounded-2xl p-2">
                                <CarOutlined className="text-4xl text-orange-500 mb-4 block" />
                                <Title level={4} className="mb-2">Flexible Options</Title>
                                <Paragraph className="text-gray-500 m-0">From 1 hour to 1 month, find a space that perfectly fits your schedule.</Paragraph>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-brand-600 py-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <Title level={2} className="text-white mb-6 text-3xl md:text-5xl font-bold">Have an empty driveway?</Title>
                    <Paragraph className="text-brand-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                        Join thousands of property owners earning passive income by listing their unused space on SmartPark.
                    </Paragraph>
                    <Link href="/register">
                        <Button
                            size="large"
                            className="h-14 px-10 text-lg font-bold rounded-full bg-white text-brand-600 border-0 hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
                        >
                            Start Earning Today
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    )
}
