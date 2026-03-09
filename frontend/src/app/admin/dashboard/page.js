'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Tag, Button, Modal, Tabs, message, Dropdown, Badge } from 'antd';
import { UserOutlined, FileProtectOutlined, CheckCircleOutlined, StopOutlined, EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import GlobalHeader from '../../../components/GlobalHeader';
import { getApiUrl } from '../../../utils/api';

const { Title, Text } = Typography;

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [pendingSpaces, setPendingSpaces] = useState([]);
    const [allSpaces, setAllSpaces] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSpaceModalVisible, setIsSpaceModalVisible] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const userStr = localStorage.getItem('userInfo');

            if (!userStr) {
                router.push('/login');
                return;
            }

            const user = JSON.parse(userStr);
            const token = user.token;

            if (!token) {
                router.push('/login');
                return;
            }

            if (user.role !== 'ADMIN') {
                message.error('Unauthorized access. Admin privileges required.');
                router.push('/login');
                return;
            }

            await fetchDashboardData();
        };

        checkAuthAndFetchData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem('userInfo');
            const token = userStr ? JSON.parse(userStr).token : null;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const [usersRes, spacesRes, allSpacesRes, bookingsRes] = await Promise.all([
                fetch(`${getApiUrl()}/admin/users`, config),
                fetch(`${getApiUrl()}/admin/spaces?status=PENDING`, config),
                fetch(`${getApiUrl()}/admin/spaces?status=ALL`, config),
                fetch(`${getApiUrl()}/admin/bookings`, config)
            ]);

            const usersData = await usersRes.json();
            const spacesData = await spacesRes.json();
            const allSpacesData = await allSpacesRes.json();
            const bookingsData = await bookingsRes.json();

            if (!usersRes.ok || !spacesRes.ok || !allSpacesRes.ok || !bookingsRes.ok) {
                throw new Error('Failed to fetch data');
            }

            setUsers(usersData);
            setPendingSpaces(spacesData);
            setAllSpaces(allSpacesData);
            setBookings(bookingsData);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            message.error('Failed to load dashboard data. Ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleSpaceApproval = async (id, status) => {
        try {
            const userStr = localStorage.getItem('userInfo');
            const token = userStr ? JSON.parse(userStr).token : null;
            const response = await fetch(`${getApiUrl()}/admin/spaces/${id}/approval`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ approvalStatus: status })
            });

            if (!response.ok) {
                throw new Error('Failed to update space status');
            }

            message.success(`Parking space ${status.toLowerCase()} successfully`);
            fetchDashboardData();
        } catch (error) {
            message.error('Failed to update space status');
        }
    };

    const handleUserSuspend = async (userId) => {
        // Implementation for suspending users will go here
        message.info('User suspension coming soon.');
    };

    const fetchMessages = async (spaceId) => {
        setChatLoading(true);
        try {
            const userStr = localStorage.getItem('userInfo');
            const token = userStr ? JSON.parse(userStr).token : null;
            const res = await fetch(`${getApiUrl()}/admin/spaces/${spaceId}/messages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Failed to fetch messages');
        } finally {
            setChatLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedSpace) return;
        try {
            const userStr = localStorage.getItem('userInfo');
            const token = userStr ? JSON.parse(userStr).token : null;
            const res = await fetch(`${getApiUrl()}/admin/spaces/${selectedSpace._id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message: newMessage })
            });

            if (res.ok) {
                const savedMsg = await res.json();
                setMessages([...messages, savedMsg]);
                setNewMessage('');
            } else {
                message.error('Failed to send message');
            }
        } catch (error) {
            message.error('Failed to send message');
        }
    };

    const showSpaceDetails = (space) => {
        setSelectedSpace(space);
        setMessages([]); // Reset on open
        setIsSpaceModalVisible(true);
        fetchMessages(space._id);
    };

    const userColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                let color = role === 'ADMIN' ? 'red' : role === 'OWNER' ? 'blue' : 'green';
                return <Tag color={color}>{role}</Tag>;
            }
        },
        { title: 'Joined', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="default" danger size="small" onClick={() => handleUserSuspend(record._id)}>
                    Suspend
                </Button>
            )
        }
    ];

    const allSpacesColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Location', dataIndex: 'location', key: 'location', render: (loc) => loc.address },
        { title: 'Owner', dataIndex: ['ownerId', 'name'], key: 'owner' },
        { title: 'Email', dataIndex: ['ownerId', 'email'], key: 'email' },
        { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
        {
            title: 'Status', dataIndex: 'approvalStatus', key: 'status', render: (status) => {
                let color = status === 'APPROVED' ? 'green' : status === 'REJECTED' ? 'red' : 'orange';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Dynamic Pricing', key: 'dynamic', render: (_, record) => {
                const dp = record.dynamicPricing;
                if (!dp || !dp.isDynamic) return <Tag color="default">Static</Tag>;
                return (
                    <div className="flex flex-col gap-1 text-xs">
                        <Tag color="purple">Multiplier: x{dp.peakMultiplier}</Tag>
                        {dp.longTermDiscount > 0 && <Tag color="green">-{dp.longTermDiscount}% Discount</Tag>}
                    </div>
                );
            }
        },
        {
            title: 'Rates ($)', dataIndex: 'rates', key: 'rates', render: (rates) => (
                <div className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold text-blue-600">${rates?.hourly || 0}/hr</span>
                    {rates?.daily && <span className="text-gray-500">${rates.daily}/day</span>}
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Badge dot={record.hasUnreadMessages}>
                        <Button type="default" size="small" icon={<EyeOutlined />} onClick={() => showSpaceDetails(record)}>
                            View
                        </Button>
                    </Badge>
                    {record.approvalStatus !== 'APPROVED' && (
                        <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleSpaceApproval(record._id, 'APPROVED')}>
                            Approve
                        </Button>
                    )}
                    {record.approvalStatus !== 'REJECTED' && (
                        <Button danger size="small" icon={<StopOutlined />} onClick={() => handleSpaceApproval(record._id, 'REJECTED')}>
                            Reject
                        </Button>
                    )}
                </div>
            )
        }
    ];

    const pendingSpaceColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Location', dataIndex: 'location', key: 'location', render: (loc) => loc.address },
        { title: 'Owner', dataIndex: ['ownerId', 'name'], key: 'owner' },
        { title: 'Email', dataIndex: ['ownerId', 'email'], key: 'email' },
        { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
        {
            title: 'Dynamic Pricing', key: 'dynamic', render: (_, record) => {
                const dp = record.dynamicPricing;
                if (!dp || !dp.isDynamic) return <Tag color="default">Static</Tag>;
                return (
                    <div className="flex flex-col gap-1 text-xs">
                        <Tag color="purple">Multiplier: x{dp.peakMultiplier}</Tag>
                        {dp.longTermDiscount > 0 && <Tag color="green">-{dp.longTermDiscount}% Discount</Tag>}
                    </div>
                );
            }
        },
        {
            title: 'Rates ($)', dataIndex: 'rates', key: 'rates', render: (rates) => (
                <div className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold text-blue-600">${rates?.hourly || 0}/hr</span>
                    {rates?.daily && <span className="text-gray-500">${rates.daily}/day</span>}
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Badge dot={record.hasUnreadMessages}>
                        <Button type="default" size="small" icon={<EyeOutlined />} onClick={() => showSpaceDetails(record)}>
                            View
                        </Button>
                    </Badge>
                    <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleSpaceApproval(record._id, 'APPROVED')}>
                        Approve
                    </Button>
                    <Button danger size="small" icon={<StopOutlined />} onClick={() => handleSpaceApproval(record._id, 'REJECTED')}>
                        Reject
                    </Button>
                </div>
            )
        }
    ];

    const bookingColumns = [
        { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
        { title: 'Driver', dataIndex: 'driverName', key: 'driver', render: (name) => name || 'Unknown User' },
        { title: 'Space', dataIndex: ['spaceId', 'location', 'address'], key: 'space', render: (address) => address || 'Removed Space' },
        { title: 'Status', dataIndex: 'paymentStatus', key: 'paymentStatus', render: (status) => <Tag color={status === 'PAID' ? 'green' : 'orange'}>{status}</Tag> },
        { title: 'Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: (price) => `$${price ? price.toFixed(2) : '0.00'}` }
    ];

    const tabItems = [
        {
            key: '1',
            label: 'Pending Spaces',
            children: <Table dataSource={pendingSpaces} columns={pendingSpaceColumns} rowKey="_id" loading={loading} />
        },
        {
            key: '2',
            label: 'Platform Spaces',
            children: <Table dataSource={allSpaces} columns={allSpacesColumns} rowKey="_id" loading={loading} />
        },
        {
            key: '3',
            label: 'User Directory',
            children: <Table dataSource={users} columns={userColumns} rowKey="_id" loading={loading} />
        },
        {
            key: '4',
            label: 'Platform Bookings',
            children: <Table dataSource={bookings} columns={bookingColumns} rowKey="_id" loading={loading} />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
            <GlobalHeader />
            <main className="flex-grow container mx-auto px-4 py-8 mt-24">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Title level={2} className="!m-0 text-slate-800 dark:text-white transition-colors">Admin Control Panel</Title>
                        <Text type="secondary" className="dark:text-slate-400">Manage users and moderate platform content</Text>
                    </div>
                </div>

                <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} sm={6}>
                        <Card hoverable className="rounded-xl shadow-sm border-blue-100 dark:border-blue-900/30 dark:bg-slate-800 transition-colors">
                            <Statistic
                                title={<span className="dark:text-slate-300">Active Drivers</span>}
                                value={users.filter(u => u.role === 'DRIVER').length}
                                valueStyle={{ color: 'var(--tw-prose-body, inherit)' }}
                                prefix={<UserOutlined className="text-blue-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card hoverable className="rounded-xl shadow-sm border-green-100 dark:border-green-900/30 dark:bg-slate-800 transition-colors">
                            <Statistic
                                title={<span className="dark:text-slate-300">Active Owners</span>}
                                value={users.filter(u => u.role === 'OWNER').length}
                                valueStyle={{ color: 'var(--tw-prose-body, inherit)' }}
                                prefix={<CheckCircleOutlined className="text-green-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card hoverable className="rounded-xl shadow-sm border-purple-100 dark:border-purple-900/30 dark:bg-slate-800 transition-colors">
                            <Statistic
                                title={<span className="dark:text-slate-300">Platform Bookings</span>}
                                value={bookings.length}
                                valueStyle={{ color: 'var(--tw-prose-body, inherit)' }}
                                prefix={<FileProtectOutlined className="text-purple-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Card hoverable className="rounded-xl shadow-sm border-yellow-100 bg-yellow-50/30 dark:border-yellow-900/30 dark:bg-slate-800 transition-colors">
                            <Statistic
                                title={<span className="dark:text-slate-300">Pending Approvals</span>}
                                value={pendingSpaces.length}
                                valueStyle={{ color: 'var(--tw-prose-body, inherit)' }}
                                prefix={<StopOutlined className="text-yellow-500" />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card className="rounded-xl shadow-sm dark:bg-slate-800 border-0 transition-colors dashboard-card">
                    <Tabs defaultActiveKey="1" items={tabItems} className="dark-tabs" />
                </Card>

                <Modal
                    title={<span className="dark:text-white">Parking Space Application Details</span>}
                    open={isSpaceModalVisible}
                    onCancel={() => setIsSpaceModalVisible(false)}
                    className="dark:bg-slate-900"
                    styles={{
                        content: { backgroundColor: 'var(--tw-prose-body, transparent)' },
                        header: { backgroundColor: 'transparent', borderBottom: '1px solid #334155' }
                    }}
                    footer={[
                        <Button key="reject" danger onClick={() => { setIsSpaceModalVisible(false); handleSpaceApproval(selectedSpace._id, 'REJECTED'); }}>Reject Application</Button>,
                        <Button key="approve" type="primary" onClick={() => { setIsSpaceModalVisible(false); handleSpaceApproval(selectedSpace._id, 'APPROVED'); }}>Approve Application</Button>
                    ]}
                >
                    {selectedSpace && (
                        <Tabs defaultActiveKey="details" className="dark-tabs">
                            <Tabs.TabPane tab="Space Details" key="details">
                                <div className="space-y-4 pt-4">
                                    <div>
                                        <Text type="secondary" className="dark:text-slate-400">Location Address:</Text>
                                        <p className="font-semibold text-lg dark:text-white">{selectedSpace.location?.address}</p>
                                    </div>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Text type="secondary" className="dark:text-slate-400">Total Capacity:</Text>
                                            <p className="font-semibold dark:text-white">{selectedSpace.capacity} Vehicle(s)</p>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary" className="dark:text-slate-400">Pricing Model:</Text>
                                            <p className="font-semibold dark:text-white">{selectedSpace.dynamicPricing?.isDynamic ? 'Dynamic Enabled' : 'Static Flat Rate'}</p>
                                            {selectedSpace.dynamicPricing?.isDynamic && (
                                                <div className="mt-1 text-sm bg-purple-50 dark:bg-purple-900/20 p-2 rounded border border-purple-100 dark:border-purple-800/50">
                                                    <p className="m-0"><span className="text-gray-500 dark:text-slate-400">Peak Hours: </span><span className="dark:text-slate-300">{selectedSpace.dynamicPricing.peakStartTime} - {selectedSpace.dynamicPricing.peakEndTime}</span></p>
                                                    <p className="m-0"><span className="text-gray-500 dark:text-slate-400">Peak Multiplier: </span><span className="font-bold text-purple-600 dark:text-purple-400">x{selectedSpace.dynamicPricing.peakMultiplier}</span></p>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Text type="secondary" className="dark:text-slate-400">Hourly Rate:</Text>
                                            <p className="font-semibold text-blue-600 dark:text-blue-400">${selectedSpace.rates?.hourly}/hr</p>

                                            {selectedSpace.rates?.customTiers?.length > 0 && (
                                                <div className="mt-2 text-sm">
                                                    <Text type="secondary" className="dark:text-slate-400">Long-Term Discount Tiers:</Text>
                                                    <ul className="list-disc pl-4 m-0 text-green-700 dark:text-green-400 font-medium">
                                                        {selectedSpace.rates.customTiers.map((tier, idx) => (
                                                            <li key={idx}>
                                                                {tier.minHours} to {tier.maxHours} hours: ${tier.rate}/hr
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary" className="dark:text-slate-400">Daily Rate:</Text>
                                            <p className="font-semibold text-blue-600 dark:text-blue-400">${selectedSpace.rates?.daily}/day</p>
                                        </Col>
                                    </Row>
                                    <div>
                                        <Text type="secondary" className="dark:text-slate-400">Rules & Regulations defined by Owner:</Text>
                                        <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 mt-2">
                                            {(() => {
                                                const rules = selectedSpace.rules;
                                                if (!rules || rules.length === 0) {
                                                    return <Text type="secondary" className="italic dark:text-slate-500">No specific rules provided</Text>;
                                                }

                                                let rulesArray = [];
                                                if (Array.isArray(rules)) {
                                                    rulesArray = rules;
                                                } else if (typeof rules === 'string') {
                                                    // Split by newlines or commas
                                                    rulesArray = rules.split(/[,\n]/).map(r => r.trim()).filter(r => r.length > 0);
                                                }

                                                if (rulesArray.length === 0) {
                                                    return <Text type="secondary" className="italic dark:text-slate-500">No specific rules provided</Text>;
                                                }

                                                return (
                                                    <ul className="list-disc pl-4 m-0 text-sm text-gray-700 dark:text-slate-300">
                                                        {rulesArray.map((rule, idx) => (
                                                            <li key={idx} className="mb-1">{rule}</li>
                                                        ))}
                                                    </ul>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Discussion" key="chat">
                                <div className="flex flex-col h-[400px]">
                                    <div className="flex-grow overflow-y-auto bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded p-4 mb-4">
                                        {chatLoading ? (
                                            <div className="text-center text-gray-400 mt-10">Loading messages...</div>
                                        ) : messages.length === 0 ? (
                                            <div className="text-center text-gray-400 mt-10">No messages yet. Start the discussion!</div>
                                        ) : (
                                            messages.map(msg => {
                                                const isAdminMode = msg.senderRole === 'ADMIN';
                                                return (
                                                    <div key={msg._id} className={`mb-4 flex flex-col ${isAdminMode ? 'items-end' : 'items-start'}`}>
                                                        <div className="mb-1 text-xs text-gray-500 dark:text-slate-400">
                                                            {msg.senderId?.name} ({msg.senderRole}) • {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        <div className={`px-4 py-2 rounded-lg max-w-[85%] ${isAdminMode ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-white rounded-bl-none shadow-sm'}`}>
                                                            {msg.message}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <textarea
                                            className="w-full flex-grow p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                                            rows="2"
                                            placeholder="Type a message to the space owner..."
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                        />
                                        <Button type="primary" className="h-full px-6" onClick={handleSendMessage}>Send</Button>
                                    </div>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    )}
                </Modal>
            </main>
        </div>
    );
}
