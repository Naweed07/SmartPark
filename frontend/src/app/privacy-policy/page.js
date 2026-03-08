'use client';

import { Typography, Row, Col, Card, Divider, Button } from 'antd';
import { SafetyCertificateOutlined, ProfileOutlined, EnvironmentOutlined, CreditCardOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-[#f8fafc] dark:bg-slate-950 pt-32 pb-24 px-6 text-center relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#1363DF]/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#1363DF]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <Title level={1} className="text-[#0A1A3F] dark:text-white mb-6 text-4xl md:text-6xl font-extrabold tracking-tight transition-colors duration-300">
                        Privacy <span className="text-[#1363DF] font-bold">Policy</span>
                    </Title>
                    <Text className="text-lg md:text-xl text-gray-500 dark:text-[#BACDE0] block mb-8 leading-relaxed max-w-3xl mx-auto transition-colors duration-300">
                        Your privacy is critically important to us. Learn how SmartPark collects, uses, and protects your personal information.
                    </Text>
                </div>
            </div>

            {/* Content Section */}
            <div className="py-16 px-6 max-w-4xl mx-auto">
                <Card className="rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-[0_10px_40px_rgba(10,26,63,0.05)] bg-white dark:bg-slate-800/80 backdrop-blur-sm p-4 md:p-8 transition-colors duration-300">

                    <div className="mb-10">
                        <Title level={2} className="text-[#0A1A3F] dark:text-white font-bold mb-4 transition-colors duration-300">1. Introduction</Title>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-base leading-relaxed transition-colors duration-300">
                            Welcome to SmartPark. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website or use our application, regardless of where you visit it from, and tell you about your privacy rights and how the law protects you.
                        </Paragraph>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-base leading-relaxed transition-colors duration-300">
                            By accessing or using SmartPark, you agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
                        </Paragraph>
                    </div>

                    <Divider className="border-gray-200 dark:border-slate-700 transition-colors duration-300" />

                    <div className="mb-10 mt-10">
                        <Title level={2} className="text-[#0A1A3F] dark:text-white font-bold mb-6 transition-colors duration-300">2. Information We Collect</Title>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-base leading-relaxed mb-6 transition-colors duration-300">
                            We collect several types of information from and about users of our application, including information by which you may be personally identified, such as:
                        </Paragraph>

                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={12}>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 transition-colors duration-300">
                                    <ProfileOutlined className="text-3xl text-[#1363DF] mb-4" />
                                    <Title level={4} className="text-[#0A1A3F] dark:text-white mb-2 transition-colors duration-300">Profile Data</Title>
                                    <Text className="text-gray-500 dark:text-slate-400 block transition-colors duration-300">Includes username, first name, last name, email address, and telephone number.</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 transition-colors duration-300">
                                    <EnvironmentOutlined className="text-3xl text-[#1363DF] mb-4" />
                                    <Title level={4} className="text-[#0A1A3F] dark:text-white mb-2 transition-colors duration-300">Location Data</Title>
                                    <Text className="text-gray-500 dark:text-slate-400 block transition-colors duration-300">We may collect real-time information about the location of your device to help you find parking.</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 transition-colors duration-300">
                                    <CreditCardOutlined className="text-3xl text-[#1363DF] mb-4" />
                                    <Title level={4} className="text-[#0A1A3F] dark:text-white mb-2 transition-colors duration-300">Transaction Data</Title>
                                    <Text className="text-gray-500 dark:text-slate-400 block transition-colors duration-300">Includes details about payments to and from you, and details of spaces you have booked.</Text>
                                </div>
                            </Col>
                            <Col xs={24} sm={12}>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-600 transition-colors duration-300">
                                    <SafetyCertificateOutlined className="text-3xl text-[#1363DF] mb-4" />
                                    <Title level={4} className="text-[#0A1A3F] dark:text-white mb-2 transition-colors duration-300">Vehicle Data</Title>
                                    <Text className="text-gray-500 dark:text-slate-400 block transition-colors duration-300">License plate details, vehicle make, and model to ensure proper booking and security.</Text>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <Divider className="border-gray-200 dark:border-slate-700 transition-colors duration-300" />

                    <div className="mb-10 mt-10">
                        <Title level={2} className="text-[#0A1A3F] dark:text-white font-bold mb-4 transition-colors duration-300">3. How We Use Your Information</Title>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-base leading-relaxed mb-4 transition-colors duration-300">
                            We use information that we collect about you or that you provide to us, including any personal information:
                        </Paragraph>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-300 text-base mb-6 transition-colors duration-300">
                            <li>To present our platform and its contents to you.</li>
                            <li>To provide you with information, products, or services that you request from us.</li>
                            <li>To facilitate parking bookings and process transactions.</li>
                            <li>To notify you about changes to our application or any products or services we offer.</li>
                            <li>To improve our platform, user experience, and customer service.</li>
                            <li>To enforce our terms and conditions and prevent fraudulent activity.</li>
                        </ul>
                    </div>

                    <Divider className="border-gray-200 dark:border-slate-700 transition-colors duration-300" />

                    <div className="mb-10 mt-10">
                        <Title level={2} className="text-[#0A1A3F] dark:text-white font-bold mb-4 transition-colors duration-300">4. Data Security</Title>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-base leading-relaxed transition-colors duration-300">
                            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls. Any payment transactions will be encrypted using SSL technology.
                        </Paragraph>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-base leading-relaxed transition-colors duration-300">
                            The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our application, you are responsible for keeping this password confidential. We ask you not to share your password with anyone.
                        </Paragraph>
                    </div>

                    <Divider className="border-gray-200 dark:border-slate-700 transition-colors duration-300" />

                    <div className="mb-10 mt-10">
                        <Title level={2} className="text-[#0A1A3F] dark:text-white font-bold mb-4 transition-colors duration-300">5. Changes to Our Privacy Policy</Title>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-base leading-relaxed transition-colors duration-300">
                            It is our policy to post any changes we make to our privacy policy on this page with a notice that the privacy policy has been updated on the application home page. If we make material changes to how we treat our users' personal information, we will notify you by email to the primary email address specified in your account and/or through a notice on the application home page.
                        </Paragraph>
                    </div>

                    <div className="mt-10 bg-[#E6EDF2] dark:bg-slate-700/60 p-8 rounded-2xl text-center border border-transparent dark:border-slate-600 transition-colors duration-300">
                        <Title level={3} className="text-[#0A1A3F] dark:text-white font-bold mb-4 transition-colors duration-300">Questions about our privacy policy?</Title>
                        <Paragraph className="text-gray-600 dark:text-slate-300 text-base leading-relaxed mb-6 transition-colors duration-300">
                            If you have questions or concerns about this privacy policy and our privacy practices, please contact us.
                        </Paragraph>
                        <Button type="primary" size="large" className="bg-[#1363DF] hover:!bg-[#0A1A3F] border-none px-8 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold">
                            Contact Support
                        </Button>
                    </div>

                </Card>
            </div>
        </div>
    );
}
