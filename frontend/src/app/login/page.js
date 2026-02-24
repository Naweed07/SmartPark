'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '../../utils/api';

const { Title, Text } = Typography;

export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch(`${getApiUrl()}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                message.success('Login successful!');
                if (data.role === 'OWNER') {
                    router.push('/owner/dashboard');
                } else {
                    router.push('/search');
                }
            } else {
                message.error(data.message || 'Login failed');
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
                    <Title level={2} className="text-gray-900 mb-2">Welcome Back</Title>
                    <Text className="text-gray-500">Sign in to SmartPark to continue</Text>
                </div>

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email or Username!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Email or Username" className="rounded-lg" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Password"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full h-12 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all" loading={loading}>
                            Sign in
                        </Button>
                    </Form.Item>

                    <div className="text-center text-gray-500 mt-4">
                        Don't have an account? <Link href="/register" className="text-brand-600 hover:text-brand-500 font-medium">Register now</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
}
