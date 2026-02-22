'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function Register() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                message.success('Registration successful!');
                if (data.role === 'OWNER') {
                    router.push('/owner/dashboard');
                } else {
                    router.push('/search');
                }
            } else {
                message.error(data.message || 'Registration failed');
            }
        } catch (error) {
            message.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl overflow-hidden">
                <div className="text-center mb-8">
                    <Title level={2} className="text-gray-900 mb-2">Create Account</Title>
                    <Text className="text-gray-500">Join SmartPark today</Text>
                </div>

                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    initialValues={{ role: 'DRIVER' }}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your Name!' }]}
                    >
                        <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Full Name" className="rounded-lg" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Email Address" className="rounded-lg" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your Password!' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Password"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item name="role" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="DRIVER">I am a Driver (Looking for spaces)</Select.Option>
                            <Select.Option value="OWNER">I am an Owner (Listing spaces)</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full h-12 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all" loading={loading}>
                            Sign Up
                        </Button>
                    </Form.Item>

                    <div className="text-center text-gray-500 mt-4">
                        Already have an account? <Link href="/login" className="text-brand-600 hover:text-brand-500 font-medium">Log in</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
