'use client';

import { Typography, Row, Col, Card, Form, Input, Button, message } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, SendOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text, Paragraph } = Typography;

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        // Simulate sending a message
        setTimeout(() => {
            message.success('Thank you for contacting us! We will get back to you shortly.');
            form.resetFields();
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <Title level={1} className="text-gray-800 m-0 mb-4 text-4xl font-bold">Contact Us</Title>
                    <Text className="text-xl text-gray-500 max-w-2xl mx-auto block leading-relaxed">
                        Have a question about booking a space, or interested in listing your driveway for cash? We're here to help.
                    </Text>
                </div>

                <Row gutter={[48, 48]} justify="center">
                    {/* Contact Info Cards */}
                    <Col xs={24} md={10}>
                        <div className="flex flex-col gap-6">
                            <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow bg-white p-2">
                                <div className="flex items-start gap-4">
                                    <div className="bg-brand-50 p-4 rounded-xl">
                                        <EnvironmentOutlined className="text-2xl text-brand-500" />
                                    </div>
                                    <div>
                                        <Title level={4} className="m-0 mb-1">Our Headquarters</Title>
                                        <Text className="text-gray-500 leading-relaxed block">
                                            123 Market Street, Suite 400<br />
                                            Kandy, Central Province<br />
                                            Sri Lanka 20000
                                        </Text>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow bg-white p-2">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <PhoneOutlined className="text-2xl text-blue-500" />
                                    </div>
                                    <div>
                                        <Title level={4} className="m-0 mb-1">Call Us Directly</Title>
                                        <Text className="text-gray-500 block mb-1">General Inquiries: +94 (077) 888-0890</Text>
                                        <Text className="text-gray-500 block">Support: +94 (077) 123-4567</Text>
                                    </div>
                                </div>
                            </Card>

                            <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow bg-white p-2">
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-50 p-4 rounded-xl">
                                        <MailOutlined className="text-2xl text-orange-500" />
                                    </div>
                                    <div>
                                        <Title level={4} className="m-0 mb-1">Send an Email</Title>
                                        <Text className="text-gray-500 block mb-1">Support: support@smartpark.com</Text>
                                        <Text className="text-gray-500 block">Partnerships: hello@smartpark.com</Text>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Col>

                    {/* Contact Form */}
                    <Col xs={24} md={14}>
                        <Card className="rounded-2xl border-0 shadow-lg bg-white p-4 md:p-8">
                            <Title level={3} className="text-gray-800 m-0 mb-6">Send us a Message</Title>

                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                requiredMark="optional"
                            >
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="firstName"
                                            label={<strong className="text-gray-700">First Name</strong>}
                                            rules={[{ required: true, message: 'Please enter your first name' }]}
                                        >
                                            <Input size="large" placeholder="John" className="rounded-lg" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            name="lastName"
                                            label={<strong className="text-gray-700">Last Name</strong>}
                                            rules={[{ required: true, message: 'Please enter your last name' }]}
                                        >
                                            <Input size="large" placeholder="Doe" className="rounded-lg" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    name="email"
                                    label={<strong className="text-gray-700">Email Address</strong>}
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input size="large" placeholder="johndoe@example.com" className="rounded-lg" />
                                </Form.Item>

                                <Form.Item
                                    name="subject"
                                    label={<strong className="text-gray-700">Subject</strong>}
                                    rules={[{ required: true, message: 'Please enter a subject' }]}
                                >
                                    <Input size="large" placeholder="How can we help?" className="rounded-lg" />
                                </Form.Item>

                                <Form.Item
                                    name="message"
                                    label={<strong className="text-gray-700">Your Message</strong>}
                                    rules={[{ required: true, message: 'Please enter your message' }]}
                                >
                                    <Input.TextArea size="large" rows={5} placeholder="Write your specific question or feedback here..." className="rounded-lg resize-none" />
                                </Form.Item>

                                <Form.Item className="mb-0 mt-6">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        size="large"
                                        icon={<SendOutlined />}
                                        loading={loading}
                                        className="w-full rounded-lg h-12 text-lg font-semibold"
                                    >
                                        Send Message
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
