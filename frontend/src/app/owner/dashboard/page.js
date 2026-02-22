'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Card, Row, Col, Statistic, Button, Modal, Form, Input, InputNumber, message, Table, Tag, Divider, Popconfirm, Space } from 'antd';
import { AppstoreOutlined, PlusOutlined, UnorderedListOutlined, LogoutOutlined, EnvironmentOutlined, GlobalOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LocationPickerMapNoSSR = dynamic(
    () => import('../../../components/LocationPickerMap'),
    { ssr: false, loading: () => <div className="p-4 text-center text-gray-400">Loading Map...</div> }
);

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function OwnerDashboard() {
    const [activeMenu, setActiveMenu] = useState('1'); // '1' = Dashboard, '2' = Bookings
    const [spaces, setSpaces] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [metrics, setMetrics] = useState({ activeBookings: 0, totalRevenue: 0 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [editingSpaceId, setEditingSpaceId] = useState(null);
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

            // Fetch Spaces, Metrics, and Bookings concurrently
            const [spaceRes, metricsRes, bookingsRes] = await Promise.all([
                fetch('http://localhost:5000/api/spaces/my', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/bookings/metrics/owner', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch('http://localhost:5000/api/bookings/owner', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const spaceData = await spaceRes.json();
            const metricsData = await metricsRes.ok ? await metricsRes.json() : { activeBookings: 0, totalRevenue: 0 };
            const bookingsData = await bookingsRes.ok ? await bookingsRes.json() : [];

            if (!spaceRes.ok) {
                throw new Error(spaceData.message || 'Failed to fetch spaces');
            }

            setSpaces(spaceData);
            setMetrics(metricsData);
            setBookings(bookingsData);
        } catch (error) {
            console.error('Dashboard Error:', error);
            if (error.message.includes('Failed to fetch')) {
                message.error('Cannot connect to backend! Is your server running on port 5000?');
            } else {
                message.error(`Dashboard Error: ${error.message}`);
            }
        }
    };

    const handleSaveSpace = async (values) => {
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
            rates: {
                hourly: values.hourlyRate,
                customTiers: values.customTiers || [], // Send dynamic array to backend
                daily: values.dailyRate || 0
            },
            rules: values.rules
        };

        try {
            const endpoint = editingSpaceId
                ? `http://localhost:5000/api/spaces/${editingSpaceId}`
                : 'http://localhost:5000/api/spaces';

            const method = editingSpaceId ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                message.success(`Parking space ${editingSpaceId ? 'updated' : 'added'} successfully!`);
                closeModal();
                fetchDashboardData();
            } else {
                message.error(`Failed to ${editingSpaceId ? 'update' : 'add'} space`);
            }
        } catch (error) {
            message.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setShowMapPicker(false);
        setEditingSpaceId(null);
        form.resetFields();
    };

    const handleEditSpace = (space) => {
        setEditingSpaceId(space._id);
        form.setFieldsValue({
            name: space.name,
            address: space.location.address,
            lat: space.location.lat,
            lng: space.location.lng,
            capacity: space.capacity,
            hourlyRate: space.rates.hourly,
            customTiers: space.rates.customTiers || [], // Pre-fill dynamic array
            dailyRate: space.rates.daily || 0,
            rules: space.rules
        });
        setIsModalVisible(true);
    };

    const handleDeleteSpace = async (id) => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        try {
            const res = await fetch(`http://localhost:5000/api/spaces/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                message.success('Parking space deleted');
                fetchDashboardData();
            } else {
                message.error('Failed to delete space');
            }
        } catch (error) {
            message.error('Network error during deletion');
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
        {
            title: 'Rates',
            key: 'rates',
            render: (_, record) => (
                <div className="flex flex-col">
                    <span>${record.rates.hourly}/1st hr</span>
                    {(record.rates.customTiers && record.rates.customTiers.length > 0) && (
                        <span className="text-xs text-gray-500">+{record.rates.customTiers.length} custom tiers</span>
                    )}
                </div>
            )
        },
        { title: 'Status', dataIndex: 'isActive', key: 'isActive', render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag> },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditSpace(record)}>Edit</Button>
                    <Popconfirm
                        title="Delete the space"
                        description="Are you sure to delete this parking space?"
                        onConfirm={() => handleDeleteSpace(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    const bookingColumns = [
        { title: 'Space', dataIndex: ['spaceId', 'name'], key: 'spaceName' },
        { title: 'Location', dataIndex: ['spaceId', 'location', 'address'], key: 'spaceLocation', ellipsis: true },
        { title: 'Driver', dataIndex: 'driverName', key: 'driverName' },
        { title: 'Vehicle', dataIndex: 'vehicleNumber', key: 'vehicleNumber' },
        { title: 'Phone', dataIndex: 'driverPhone', key: 'driverPhone' },
        { title: 'Revenue', dataIndex: 'totalAmount', key: 'totalAmount', render: (val) => <strong className="text-teal-600">${val}</strong> },
        {
            title: 'Payment',
            key: 'paymentStatus',
            render: (_, record) => {
                if (record.paymentStatus === 'PAID') return <Tag color="green">PAID Card</Tag>;
                return <Tag color="orange">PENDING Spot</Tag>;
            }
        },
        { title: 'Start', dataIndex: 'startTime', key: 'startTime', render: (val) => new Date(val).toLocaleString() },
        { title: 'End', dataIndex: 'endTime', key: 'endTime', render: (val) => new Date(val).toLocaleString() },
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
                    selectedKeys={[activeMenu]}
                    onSelect={({ key }) => {
                        if (key !== '3') setActiveMenu(key);
                    }}
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
                    {activeMenu === '1' ? (
                        <>
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
                                extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setEditingSpaceId(null); setIsModalVisible(true); }} className="rounded-lg">Add New Space</Button>}
                            >
                                <Table dataSource={spaces} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} scroll={{ x: 'max-content' }} />
                            </Card>
                        </>
                    ) : (
                        <Card
                            className="rounded-2xl shadow-sm border-0"
                            title={<Title level={4} className="m-0 pt-2">Incoming Reservations</Title>}
                        >
                            <Table dataSource={bookings} columns={bookingColumns} rowKey="_id" pagination={{ pageSize: 10 }} scroll={{ x: 'max-content' }} />
                        </Card>
                    )}
                </Content>
            </Layout>

            <Modal
                title={editingSpaceId ? "Edit Parking Space" : "Register New Parking Space"}
                open={isModalVisible}
                onCancel={closeModal}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSaveSpace} className="mt-4">
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
                            <Form.Item name="hourlyRate" label="Base Rate (1st Hr)" rules={[{ required: true }]} tooltip="Base price for the first hour of parking">
                                <InputNumber min={0} className="w-full" prefix="$" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Dynamic Custom Tiers Form List */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">Custom Pricing Tiers (Optional)</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Define special rates for extended parking durations (e.g. Hrs 2-5 = $8/hr)</p>

                        <Form.List name="customTiers">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row key={key} gutter={8} className="mb-2 flex items-center">
                                            <Col span={7}>
                                                <Form.Item {...restField} name={[name, 'minHours']} rules={[{ required: true, message: 'Missing min' }]} className="mb-0">
                                                    <InputNumber placeholder="Min Hrs" min={2} className="w-full" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={2} className="text-center text-gray-400">to</Col>
                                            <Col span={7}>
                                                <Form.Item {...restField} name={[name, 'maxHours']} rules={[{ required: true, message: 'Missing max' }]} className="mb-0">
                                                    <InputNumber placeholder="Max Hrs" min={2} className="w-full" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item {...restField} name={[name, 'rate']} rules={[{ required: true, message: 'Missing rate' }]} className="mb-0">
                                                    <InputNumber placeholder="Rate" min={0} prefix="$" className="w-full" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={2} className="text-center">
                                                <MinusCircleOutlined onClick={() => remove(name)} className="text-red-400 hover:text-red-600 cursor-pointer" />
                                            </Col>
                                        </Row>
                                    ))}
                                    <Form.Item className="mb-0 mt-2">
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="border-brand-200 text-brand-600 hover:text-brand-700 hover:border-brand-400">
                                            Add Custom Tier
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </div>

                    <Form.Item name="rules" label="Rules & Restrictions">
                        <Input.TextArea placeholder="e.g. No large trucks, open 24/7" rows={3} />
                    </Form.Item>
                    <Form.Item className="mb-0 text-right">
                        <Button onClick={closeModal} className="mr-2">Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>{editingSpaceId ? 'Update Space' : 'Save Space'}</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}
