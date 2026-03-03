'use client';

import { useState, useEffect } from 'react';
import { Typography, Card, Table, Tag, message, Modal, Button, QRCode } from 'antd';
import { getApiUrl } from '../../../utils/api';
import { useRouter } from 'next/navigation';
import { QrcodeOutlined, CheckCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function DriverDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isQrModalVisible, setIsQrModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
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

            const res = await fetch(`${getApiUrl()}/bookings/my`, {
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
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{text || 'Deleted Space'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{record.spaceId?.location?.address || 'Unknown Address'}</div>
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
            render: (val) => <Tag className="font-mono bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200">{val}</Tag>
        },
        {
            title: 'Total Paid',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (val) => <strong className="text-[#1363DF] dark:text-[#3b82f6]">${val}</strong>
        },
        {
            title: 'Payment',
            key: 'paymentStatus',
            render: (_, record) => {
                if (record.paymentStatus === 'PAID') return <Tag color="green">PAID (Card)</Tag>;
                return <Tag color="orange">PENDING (On Site)</Tag>;
            }
        },
        {
            title: 'Check-In',
            key: 'checkInStatus',
            render: (_, record) => {
                if (record.checkInStatus === 'CHECKED_IN') return <Tag icon={<CheckCircleOutlined />} color="success">Checked In</Tag>;
                if (record.status === 'CANCELLED') return <Text type="secondary">-</Text>;
                return <Tag color="processing">Pending Arrival</Tag>;
            }
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => getStatusTag(record.status, record.endTime)
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    {record.status !== 'CANCELLED' && record.checkInStatus !== 'CHECKED_IN' && (
                        <Button
                            type="primary"
                            icon={<QrcodeOutlined />}
                            onClick={() => {
                                setSelectedBooking(record);
                                setIsQrModalVisible(true);
                            }}
                            className="bg-[#1363DF] hover:!bg-[#0A1A3F] border-none shadow-sm dark:bg-[#3b82f6] dark:hover:!bg-[#2563eb]"
                        >
                            View QR
                        </Button>
                    )}
                    {record.spaceId?.location && (
                        <Button
                            type="default"
                            icon={<EnvironmentOutlined />}
                            onClick={() => {
                                let destination = '';

                                // Google Maps prefers exact coordinates for absolute precision over potentially unformatted addresses
                                if (record.spaceId.location.lat && record.spaceId.location.lng) {
                                    destination = `${record.spaceId.location.lat},${record.spaceId.location.lng}`;
                                } else if (record.spaceId.location.address) {
                                    destination = encodeURIComponent(record.spaceId.location.address);
                                }

                                if (destination) {
                                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
                                } else {
                                    message.error('Location details not available for this space.');
                                }
                            }}
                            className="text-[#1363DF] border-[#1363DF]/30 hover:border-[#1363DF] bg-[#1363DF]/5 shadow-sm dark:text-[#3b82f6] dark:border-[#3b82f6]/30 dark:hover:border-[#3b82f6] dark:bg-[#3b82f6]/10"
                        >
                            Navigate
                        </Button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 px-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Title level={2} className="m-0 dark:text-white transition-colors duration-300">My Dashboard</Title>
                    <Text className="text-gray-500 dark:text-slate-400 text-lg transition-colors duration-300">Manage your parking reservations and history.</Text>
                </div>

                <Card className="rounded-2xl shadow-sm border-0 w-full overflow-hidden dark:bg-slate-800 transition-colors duration-300 dashboard-card">
                    <Table
                        columns={columns}
                        dataSource={bookings}
                        rowKey="_id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 'max-content' }}
                        locale={{ emptyText: "You haven't made any bookings yet." }}
                        rowClassName="dark:hover:bg-slate-700/50 transition-colors"
                    />
                </Card>

                {/* QR Code Modal for Check-in */}
                <Modal
                    title="Your Booking QR Code"
                    open={isQrModalVisible}
                    onCancel={() => {
                        setIsQrModalVisible(false);
                        setSelectedBooking(null);
                    }}
                    footer={[
                        <Button key="close" onClick={() => setIsQrModalVisible(false)} className="dark:bg-slate-800 dark:text-white dark:border-slate-600">
                            Close
                        </Button>
                    ]}
                    centered
                >
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <Text className="text-gray-500 dark:text-slate-400 mb-6 block max-w-sm">
                            Show this QR code to the parking space owner when you arrive to check-in securely.
                        </Text>

                        {selectedBooking && (
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                                <QRCode
                                    value={selectedBooking._id}
                                    size={250}
                                    color="#0a1f44" // brand color
                                    bgColor="transparent"
                                />
                            </div>
                        )}

                        {selectedBooking && (
                            <div className="mt-6">
                                <Title level={5} className="m-0 text-gray-800 dark:text-gray-200">{selectedBooking.spaceId?.name}</Title>
                                <Text className="font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-sm mt-2 block">
                                    ID: {selectedBooking._id}
                                </Text>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
}
