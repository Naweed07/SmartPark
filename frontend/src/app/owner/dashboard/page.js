'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Card, Row, Col, Statistic, Button, Modal, Form, Input, InputNumber, message, Table, Tag } from 'antd';
import { AppstoreOutlined, PlusOutlined, UnorderedListOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function OwnerDashboard() {
    const [spaces, setSpaces] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo || JSON.parse(userInfo).role !== 'OWNER') {
            router.push('/login');
            return;
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        try {
            // Fetch Spaces
            const spaceRes = await fetch('http://localhost:5000/api/spaces/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const spaceData = await spaceRes.json();
            setSpaces(spaceData);

            // Simple implementation: normally you'd fetch bookings across all spaces
            // Here we just fetch for the first space as an example, or create a specific aggregate route
        } catch (error) {
            message.error('Error fetching dashboard data');
        }
    };

    const handleAddSpace = async (values) => {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('userInfo')).token;

        const payload = {
            name: values.name,
            location: { address: values.address },
            capacity: values.capacity,
            rates: { hourly: values.hourlyRate, daily: values.dailyRate || 0 },
            rules: values.rules
        };

        try {
            const res = await fetch('http://localhost:5000/api/spaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                message.success('Parking space added successfully!');
                setIsModalVisible(false);
                form.resetFields();
                fetchDashboardData();
            } else {
                message.error('Failed to add space');
            }
        } catch (error) {
            message.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        router.push('/login');
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Address', dataIndex: ['location', 'address'], key: 'address' },
        { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
        { title: 'Hourly Rate', dataIndex: ['rates', 'hourly'], key: 'hourly', render: (text) => `$${text}` },
        { title: 'Status', dataIndex: 'isActive', key: 'isActive', render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag> },
    ];

    return (
        <Layout className="min-h-screen">
            <Sider breakpoint="lg" collapsedWidth="0" className="bg-white shadow-xl z-10" width={250}>
                <div className="p-6">
                    <Title level={3} className="text-brand-600 m-0">Smart<span className="text-gray-900">Park</span></Title>
                </div>
                <Menu mode="inline" defaultSelectedKeys={['1']} className="border-r-0">
                    <Menu.Item key="1" icon={<AppstoreOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item key="2" icon={<UnorderedListOutlined />}>My Bookings</Menu.Item>
                    <Menu.Item key="3" icon={<LogoutOutlined />} onClick={logout} className="text-red-500 mt-auto">Logout</Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Header className="bg-white px-8 flex items-center justify-between shadow-sm">
                    <Title level={4} className="m-0">Owner Dashboard</Title>
                    <div className="flex items-center gap-4">
                        <span className="font-medium">Welcome!</span>
                    </div>
                </Header>

                <Content className="p-8 bg-gray-50">
                    <Row gutter={[24, 24]} className="mb-8">
                        <Col xs={24} sm={8}>
                            <Card className="rounded-2xl shadow-sm border-0">
                                <Statistic title="Total Spaces Listed" value={spaces.length} valueStyle={{ color: '#14b8a6' }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card className="rounded-2xl shadow-sm border-0">
                                <Statistic title="Active Bookings (Mock)" value={12} valueStyle={{ color: '#3f83f8' }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card className="rounded-2xl shadow-sm border-0">
                                <Statistic title="Total Revenue (Mock)" value={845} prefix="$" valueStyle={{ color: '#10b981' }} />
                            </Card>
                        </Col>
                    </Row>

                    <Card
                        className="rounded-2xl shadow-sm border-0"
                        title={<Title level={4} className="m-0 pt-2">My Parking Spaces</Title>}
                        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="rounded-lg">Add New Space</Button>}
                    >
                        <Table dataSource={spaces} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} />
                    </Card>
                </Content>
            </Layout>

            <Modal
                title="Register New Parking Space"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleAddSpace} className="mt-4">
                    <Form.Item name="name" label="Space Name" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Downtown Prime Garage" />
                    </Form.Item>
                    <Form.Item name="address" label="Full Address" rules={[{ required: true }]}>
                        <Input placeholder="123 Main St, City" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="capacity" label="Total Slots" rules={[{ required: true }]}>
                                <InputNumber min={1} className="w-full" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="hourlyRate" label="Hourly Rate ($)" rules={[{ required: true }]}>
                                <InputNumber min={0} className="w-full" prefix="$" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="rules" label="Rules & Restrictions">
                        <Input.TextArea placeholder="e.g. No large trucks, open 24/7" rows={3} />
                    </Form.Item>
                    <Form.Item className="mb-0 text-right">
                        <Button onClick={() => setIsModalVisible(false)} className="mr-2">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>Save Space</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}
