'use client';

import { Button, Row, Col, Card, Typography } from 'antd';
import Link from 'next/link';
import { SearchOutlined, EnvironmentOutlined, SafetyCertificateOutlined, DollarOutlined, ClockCircleOutlined, CarOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function Home() {
    return (
        <main className="min-h-screen bg-soft-light overflow-hidden">
            {/* Hero Section */}
            <div className="w-full bg-[#E6EDF2] px-4 md:px-8 lg:px-12 py-20 md:py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-6 flex flex-col gap-6 relative z-10">
                        <Title level={1} className="text-4xl md:text-5xl lg:text-6xl font-[900] text-[#0A1A3F] leading-tight mb-2 tracking-tight">
                            SmartPark: <br />
                            <span className="text-[#1363DF] text-6xl font-bold"> The Future of Parking</span>
                        </Title>

                        <Paragraph className="text-lg text-slate-600 max-w-lg mb-4">
                            Connect with verified hosts for premium parking spots, or turn your empty driveway into a reliable source of passive income.
                        </Paragraph>

                        {/* Dark Blue Options Box (Premium Glassy) */}
                        <div className="bg-[#0A1A3F] rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(10,26,63,0.3)] relative overflow-hidden">
                            {/* subtle decor inside box */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] pointer-events-none"></div>
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#1363DF]/50 rounded-full blur-[40px] pointer-events-none"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#1363DF]/10 to-transparent pointer-events-none"></div>

                            <h3 className="text-white text-xl md:text-2xl font-semibold mb-6 text-center relative z-10">
                                Start Your Journey
                            </h3>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 w-full">
                                <Link href="/search" className="w-full sm:w-auto">
                                    <Button
                                        size="large"
                                        icon={<SearchOutlined />}
                                        className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-full hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] text-white hover:bg-white/20 hover:border-white/40"
                                    >
                                        Find a Spot
                                    </Button>
                                </Link>
                                <Link href="/register" className="w-full sm:w-auto">
                                    <Button
                                        size="large"
                                        icon={<EnvironmentOutlined />}
                                        className="w-full sm:w-auto list-btn h-14 px-8 text-lg font-semibold rounded-full hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border border-[#1363DF] bg-[#1363DF]/90 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(19,99,223,0.4)] text-white hover:bg-[#1363DF] hover:border-blue-400"
                                    >
                                        List Your Space
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Light Blue Services Box (Glassy) */}
                        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 flex flex-col xl:flex-row items-center xl:items-start justify-between gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-2">
                            <div className="text-center xl:text-left">
                                <h4 className="text-[#0A1A3F] font-extrabold text-lg mb-2">Join the SmartPark Network</h4>
                                <p className="text-[#2C3E50] text-sm leading-relaxed max-w-sm m-0">
                                    Experience a secure, cost-effective, and transparent parking ecosystem designed to empower drivers and property owners.
                                </p>
                            </div>
                            <Button
                                className="learn-more-btn rounded-2xl px-8 h-12 font-semibold shadow-lg shadow-blue-500/30 whitespace-nowrap mt-2 xl:mt-0 transition-all hover:scale-105 "
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>

                    {/* Right Content Images Grid */}
                    <div className="lg:col-span-6 flex flex-col gap-6 relative z-10">
                        {/* Top Image: Car Landscape */}
                        <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl relative bg-blue-100 group">
                            <img
                                src="/smartparkbannerHero.png"
                                alt="SmartPark Parking"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Bottom Sub-grid for map/abstract content */}
                        <div className="w-full flex justify-start">
                            <div className="w-full h-[200px] md:h-[250px] rounded-[2rem] overflow-hidden shadow-xl relative bg-[#DCE4ED] group flex items-center justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=1200&auto=format&fit=crop"
                                    alt="Parking Top View"
                                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Play icon overlay linked to YouTube */}
                                <a href="https://youtu.be/p3gGMSokWAE?si=hMHZloN7X_hwY_eS" target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-[#0A1A3F] border-b-8 border-b-transparent ml-1"></div>
                                    </div>
                                </a>
                            </div>
                        </div>
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


            {/* Why choose smartpark section start */}


            {/* Why choose us section end */}
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
