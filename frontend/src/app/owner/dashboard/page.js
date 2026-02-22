'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Card, Row, Col, Statistic, Button, Modal, Form, Input, InputNumber, message, Table, Tag, Divider } from 'antd';
import { AppstoreOutlined, PlusOutlined, UnorderedListOutlined, LogoutOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LocationPickerMapNoSSR = dynamic(
    () => import('../../../components/LocationPickerMap'),
    { ssr: false, loading: () => <div className="p-4 text-center text-gray-400">Loading Map...</div> }
);

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function OwnerDashboard() {
    const [spaces, setSpaces] = useState([]);
    const [metrics, setMetrics] = useState({ activeBookings: 0, totalRevenue: 0 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
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
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) return;
            const token = JSON.parse(userInfo).token;

            // Fetch Spaces and Metrics currently
            const [spaceRes, metricsRes] = await Promise.all([
                fetch('http://localhost:5000/api/spaces/my', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/bookings/metrics/owner', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const spaceData = await spaceRes.json();
            const metricsData = await metricsRes.ok ? await metricsRes.json() : { activeBookings: 0, totalRevenue: 0 };

            if (!spaceRes.ok) {
                throw new Error(spaceData.message || 'Failed to fetch spaces');
            }

            setSpaces(spaceData);
            setMetrics(metricsData);
        } catch (error) {
            console.error('Dashboard Error:', error);
            if (error.message.includes('Failed to fetch')) {
                message.error('Cannot connect to backend! Is your server running on port 5000?');
            } else {
                message.error(`Dashboard Error: ${error.message}`);
            }
        }
    };

    const handleAddSpace = async (values) => {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('userInfo')).token;

        const payload = {
            name: values.name,
            location: {
                address: values.address,
                lat: values.lat,
                lng: values.lng
            },
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
                setShowMapPicker(false);
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

    const fetchCurrentLocationInfo = () => {
        if (!navigator.geolocation) {
            message.error("Geolocation is not supported by your browser");
            return;
        }

        message.loading({ content: 'Fetching GPS coordinates...', key: 'location' });
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                // Reverse geocoding using OSM Nominatim
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();

                if (data && data.display_name) {
                    form.setFieldsValue({
                        address: data.display_name,
                        lat: latitude,
                        lng: longitude
                    });
                    message.success({ content: 'Address fetched successfully!', key: 'location' });
                } else {
                    message.error({ content: 'Could not resolve address from GPS', key: 'location' });
                }
            } catch (error) {
                message.error({ content: 'Error reversing geolocation data', key: 'location' });
            }
        }, () => {
            message.error({ content: 'Please allow browser location access to use this feature', key: 'location' });
        });
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        router.push('/login');
    };

    const handleMapLocationSelect = (locationData) => {
        form.setFieldsValue({
            address: locationData.address,
            lat: locationData.lat,
            lng: locationData.lng
        });
        setShowMapPicker(false);
        message.success('Location pinned from map!');
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
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    className="border-r-0"
                    items={[
                        { key: '1', icon: <AppstoreOutlined />, label: 'Dashboard' },
                        { key: '2', icon: <UnorderedListOutlined />, label: 'My Bookings' },
                        { key: '3', icon: <LogoutOutlined />, label: 'Logout', className: 'text-red-500 mt-auto', onClick: logout },
                    ]}
                />
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
                                <Statistic title="Active Bookings" value={metrics.activeBookings} valueStyle={{ color: '#3f83f8' }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card className="rounded-2xl shadow-sm border-0">
                                <Statistic title="Total Revenue" value={metrics.totalRevenue} prefix="$" valueStyle={{ color: '#10b981' }} />
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

                    <Form.Item label="Full Address" required className="mb-4">
                        <div className="flex flex-col gap-3 relative">
                            <Form.Item name="address" rules={[{ required: true, message: 'Please provide the address' }]} noStyle>
                                <Input placeholder="123 Main St, City" className="pr-10" />
                            </Form.Item>

                            <div className="flex gap-2">
                                <Button
                                    type="dashed"
                                    icon={<EnvironmentOutlined />}
                                    onClick={fetchCurrentLocationInfo}
                                    className="flex-1 text-brand-600 border-brand-200 hover:border-brand-400 bg-brand-50"
                                >
                                    Auto-Detect URL Location
                                </Button>
                                <Button
                                    type="primary"
                                    ghost
                                    icon={<GlobalOutlined />}
                                    onClick={() => setShowMapPicker(!showMapPicker)}
                                    className="border-brand-300 text-brand-600"
                                >
                                    {showMapPicker ? 'Hide Map' : 'Pin on Map'}
                                </Button>
                            </div>

                            {/* Show the interactive Map Picker exactly when requested */}
                            {showMapPicker && (
                                <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
                                    <p className="text-sm text-gray-500 mb-2 font-medium">Select Pin Location:</p>
                                    <LocationPickerMapNoSSR
                                        initialPosition={form.getFieldValue('lat') ? { lat: form.getFieldValue('lat'), lng: form.getFieldValue('lng') } : null}
                                        onConfirm={handleMapLocationSelect}
                                    />
                                </div>
                            )}
                        </div>
                    </Form.Item>

                    {/* Hidden fields to save the exact lat/lng coordinates to the database */}
                    <Form.Item name="lat" hidden><Input /></Form.Item>
                    <Form.Item name="lng" hidden><Input /></Form.Item>

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
