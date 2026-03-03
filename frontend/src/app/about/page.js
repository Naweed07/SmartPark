'use client';

import { Typography, Row, Col, Card, Button } from 'antd';
import { SafetyCertificateOutlined, ThunderboltOutlined, TeamOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Title, Text, Paragraph } = Typography;

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-[#0A1A3F] dark:bg-slate-950 pt-32 pb-24 px-6 text-center relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#1363DF]/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#1363DF]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <Title level={1} className="text-white mb-6 text-4xl md:text-6xl font-extrabold tracking-tight">
                        About <span className="text-[#1363DF] font-bold">SmartPark</span>
                    </Title>
                    <Text className="text-lg md:text-xl text-[#BACDE0] block mb-8 leading-relaxed max-w-3xl mx-auto">
                        We are on a mission to completely eliminate parking stress from urban life while helping property owners monetize their unused spaces.
                    </Text>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <Row gutter={[64, 48]} className="items-center mb-32">
                    <Col xs={24} md={12}>
                        <Title level={2} className="text-[#0A1A3F] dark:text-white mb-6 font-extrabold text-3xl md:text-4xl tracking-tight transition-colors duration-300">Our Story</Title>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed mb-6 transition-colors duration-300">
                            SmartPark was born out of frustration. Our founders spent thousands of hours circling city blocks looking for parking spaces, while countless driveways sat empty right next to them.
                        </Paragraph>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed mb-6 transition-colors duration-300">
                            We realized there was a massive disconnect. Property owners had space they didn't need during the day, and drivers needed that exact space.
                        </Paragraph>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed transition-colors duration-300">
                            Today, SmartPark bridges that gap. Our platform seamlessly connects drivers needing a spot with owners who have one to spare, creating a smarter, greener, and more efficient urban ecosystem.
                        </Paragraph>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="bg-[#E6EDF2]/40 dark:bg-slate-800/40 rounded-[3rem] h-[500px] flex justify-center items-center relative overflow-hidden border border-gray-100/50 dark:border-slate-700/50 transition-colors duration-300">
                            {/* Graphic background dots */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0A1A3F 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop" alt="SmartPark Owner" className="absolute w-[75%] h-[80%] object-cover rounded-[2rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700" />

                            {/* Floating stat card 1 */}
                            <div className="p-6 text-center bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl w-52 absolute right-2 bottom-12 shadow-[0_20px_50px_rgba(10,26,63,0.08)] transform -rotate-3 hover:scale-105 transition-all">
                                <Title level={2} className="m-0 text-[#0A1A3F] dark:text-white font-extrabold mb-1">10k+</Title>
                                <Text className="font-semibold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Drivers Parked</Text>
                            </div>

                            {/* Floating stat card 2 */}
                            <div className="p-6 text-center text-white bg-[#0A1A3F] border border-gray-800 rounded-3xl w-52 absolute left-2 top-12 shadow-[0_20px_50px_rgba(10,26,63,0.15)] transform rotate-6 hover:scale-105 transition-all">
                                <Title level={2} className="m-0 text-[#fff] font-extrabold mb-1"><span className="text-white">$</span><span className="text-white">500k</span></Title>
                                <Text className="font-medium text-[#fff] text-xs text-white uppercase tracking-wider"><span className="text-white txt-wht">Paid to Owners</span></Text>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Core Values */}
                <div className="text-center mb-16">
                    <Title level={2} className="text-[#0A1A3F] dark:text-white font-extrabold text-3xl md:text-4xl tracking-tight mb-4 transition-colors duration-300">Our Core Values</Title>
                    <p className="text-gray-500 dark:text-slate-400 text-lg transition-colors duration-300">The principles that drive our community</p>
                </div>
                <Row gutter={[32, 32]} className="mb-12">
                    <Col xs={24} md={8}>
                        <Card className="h-full rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-[0_10px_30px_rgba(10,26,63,0.03)] hover:shadow-[0_20px_40px_rgba(19,99,223,0.08)] transition-all bg-white dark:bg-slate-800 text-center p-6 group transform hover:-translate-y-2">
                            <div className="w-20 h-20 mx-auto bg-blue-50 dark:bg-slate-700 group-hover:bg-[#1363DF] rounded-full flex items-center justify-center mb-8 transition-colors duration-300">
                                <SafetyCertificateOutlined className="text-4xl text-[#1363DF] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <Title level={4} className="text-[#0A1A3F] dark:text-white font-bold mb-4 transition-colors duration-300">Trust & Security</Title>
                            <Paragraph className="text-gray-500 dark:text-slate-400 leading-relaxed m-0 text-base transition-colors duration-300">
                                Every booking is secure. We partner with reliable payment processors and verify owners to ensure your vehicle is always safe.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="h-full rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-[0_10px_30px_rgba(10,26,63,0.03)] hover:shadow-[0_20px_40px_rgba(19,99,223,0.08)] transition-all bg-white dark:bg-slate-800 text-center p-6 group transform hover:-translate-y-2">
                            <div className="w-20 h-20 mx-auto bg-blue-50 dark:bg-slate-700 group-hover:bg-[#1363DF] rounded-full flex items-center justify-center mb-8 transition-colors duration-300">
                                <ThunderboltOutlined className="text-4xl text-[#1363DF] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <Title level={4} className="text-[#0A1A3F] dark:text-white font-bold mb-4 transition-colors duration-300">Instant Convenience</Title>
                            <Paragraph className="text-gray-500 dark:text-slate-400 leading-relaxed m-0 text-base transition-colors duration-300">
                                No more guessing. Find, book, and pay for your spot in seconds. Arrive knowing exactly where you are going.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="h-full rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-[0_10px_30px_rgba(10,26,63,0.03)] hover:shadow-[0_20px_40px_rgba(19,99,223,0.08)] transition-all bg-white dark:bg-slate-800 text-center p-6 group transform hover:-translate-y-2">
                            <div className="w-20 h-20 mx-auto bg-blue-50 dark:bg-slate-700 group-hover:bg-[#1363DF] rounded-full flex items-center justify-center mb-8 transition-colors duration-300">
                                <TeamOutlined className="text-4xl text-[#1363DF] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <Title level={4} className="text-[#0A1A3F] dark:text-white font-bold mb-4 transition-colors duration-300">Community First</Title>
                            <Paragraph className="text-gray-500 dark:text-slate-400 leading-relaxed m-0 text-base transition-colors duration-300">
                                SmartPark isn't just an app; it's a community. Drivers get affordable parking while locals earn passive income.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* CTA Banner Section (Matching Home Page) */}
            <div className="bg-[#0A1A3F] dark:bg-slate-950 py-28 px-6 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-[#1363DF]/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#1363DF]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="text-center max-w-3xl mx-auto flex flex-col items-center relative z-10">
                    <h3 className="text-white text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Discover How Our Solutions Work for You
                    </h3>
                    <p className="text-[#BACDE0] text-lg md:text-xl mb-12 leading-relaxed max-w-2xl px-4">
                        Schedule a demo to explore our innovative parking solutions
                        tailored to your needs. See firsthand how our technology and
                        services can streamline parking operations and enhance convenience
                        for you and your customers.
                    </p>
                    <Button type="primary" className="btn-dark-scndry hover:!bg-white hover:!text-[#0A1A3F] border-none py-6 h-auto text-white font-bold rounded-full px-12 text-lg shadow-[0_10px_30px_rgba(19,99,223,0.3)] transition-all hover:scale-105">
                        Book A Demo & Start Earning Today
                    </Button>
                </div>
            </div>
        </div>
    );
}
