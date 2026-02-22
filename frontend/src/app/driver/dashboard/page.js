'use client';

import { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, message } from 'antd';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function DriverDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo || JSON.parse(userInfo).role !== 'DRIVER') {
            router.push('/login');
            return;
        }
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (!userInfo) return;
            const token = JSON.parse(userInfo).token;

            const res = await fetch('http://localhost:5000/api/bookings/my', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const data = await res.json();
            // Sort to show newest first
            const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(sortedData);
        } catch (error) {
            message.error('Error loading booking history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status, endTime) => {
        const now = dayjs();
        const end = dayjs(endTime);

        if (status === 'CANCELLED') return <Tag color="red">Cancelled</Tag>;
        if (now.isAfter(end)) return <Tag color="default">Completed</Tag>;

        return <Tag color="green">Active</Tag>;
    };

    const columns = [
        {
            title: 'Parking Space',
            dataIndex: ['spaceId', 'name'],
            key: 'spaceName',
            render: (text, record) => (
                <div>
                    <div className="font-semibold text-gray-800">{text || 'Deleted Space'}</div>
                    <div className="text-xs text-gray-500">{record.spaceId?.location?.address || 'Unknown Address'}</div>
                </div>
            )
        },
        {
            title: 'Arrival',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (val) => dayjs(val).format('MMM D, YYYY - h:mm A')
        },
        {
            title: 'Departure',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (val) => dayjs(val).format('MMM D, YYYY - h:mm A')
        },
        {
            title: 'Duration',
            dataIndex: 'bookedHours',
            key: 'bookedHours',
            render: (val) => `${val} hr${val > 1 ? 's' : ''}`
        },
        {
            title: 'Vehicle',
            dataIndex: 'vehicleNumber',
            key: 'vehicleNumber',
            render: (val) => <Tag className="font-mono bg-gray-100">{val}</Tag>
        },
        {
            title: 'Total Paid',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val) => <strong className="text-teal-600">${val}</strong>
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => getStatusTag(record.status, record.endTime)
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Title level={2} className="m-0">My Dashboard</Title>
                    <Text className="text-gray-500 text-lg">Manage your parking reservations and history.</Text>
                </div>

                <Card className="rounded-2xl shadow-sm border-0 w-full overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={bookings}
                        rowKey="_id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content' }}
                        locale={{ emptyText: "You haven't made any bookings yet." }}
                    />
                </Card>
            </div>
        </div>
    );
}
