'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Table, Tag, Button, Modal, Tabs, message, Dropdown } from 'antd';
import { UserOutlined, FileProtectOutlined, CheckCircleOutlined, StopOutlined, MoreOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import GlobalHeader from '../../../components/GlobalHeader';
import { getApiUrl } from '../../../utils/api';

const { Title, Text } = Typography;

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [pendingSpaces, setPendingSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
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

            const [usersRes, spacesRes] = await Promise.all([
                fetch(`${getApiUrl()}/admin/users`, config),
                fetch(`${getApiUrl()}/admin/spaces?status=PENDING`, config)
            ]);

            const usersData = await usersRes.json();
            const spacesData = await spacesRes.json();

            if (!usersRes.ok || !spacesRes.ok) {
                throw new Error('Failed to fetch data');
            }

            setUsers(usersData);
            setPendingSpaces(spacesData);
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

    const spaceColumns = [
        { title: 'Location', dataIndex: 'location', key: 'location', render: (loc) => loc.address },
        { title: 'Owner', dataIndex: ['ownerId', 'name'], key: 'owner' },
        { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
        { title: 'Rates ($)', dataIndex: 'rates', key: 'rates', render: (rates) => `${rates.hourly}/hr` },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex gap-2">
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

    const tabItems = [
        {
            key: '1',
            label: 'Pending Spaces',
            children: <Table dataSource={pendingSpaces} columns={spaceColumns} rowKey="_id" loading={loading} />
        },
        {
            key: '2',
            label: 'User Directory',
            children: <Table dataSource={users} columns={userColumns} rowKey="_id" loading={loading} />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <GlobalHeader />
            <main className="flex-grow container mx-auto px-4 py-8 mt-24">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Title level={2} className="!m-0 text-slate-800">Admin Control Panel</Title>
                        <Text type="secondary">Manage users and moderate platform content</Text>
                    </div>
                </div>

                <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} sm={8}>
                        <Card hoverable className="rounded-xl shadow-sm border-blue-100">
                            <Statistic
                                title="Total Users"
                                value={users.length}
                                prefix={<UserOutlined className="text-blue-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card hoverable className="rounded-xl shadow-sm border-yellow-100 bg-yellow-50/30">
                            <Statistic
                                title="Pending Approvals"
                                value={pendingSpaces.length}
                                prefix={<FileProtectOutlined className="text-yellow-500" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card hoverable className="rounded-xl shadow-sm border-green-100">
                            <Statistic
                                title="Active Owners"
                                value={users.filter(u => u.role === 'OWNER').length}
                                prefix={<CheckCircleOutlined className="text-green-500" />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card className="rounded-xl shadow-sm">
                    <Tabs defaultActiveKey="1" items={tabItems} />
                </Card>
            </main>
        </div>
    );
}
