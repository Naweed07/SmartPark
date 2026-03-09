'use client';

import { useState, useEffect } from 'react';
import { QRCode, Modal, Button, Typography, Table, Tag, message, Card } from 'antd';
import { getApiUrl } from '../../../utils/api';
import { useRouter } from 'next/navigation';
import { QrcodeOutlined, CheckCircleOutlined, EnvironmentOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Script from 'next/script';

const { Title, Text } = Typography;

export default function DriverDashboard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isQrModalVisible, setIsQrModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [receiptData, setReceiptData] = useState(null);
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

    const handleDownloadReceipt = () => {
        const element = document.getElementById('receipt-content');
        if (!element) return;

        const opt = {
            margin: 0.1,
            filename: `SmartPark_Receipt_${receiptData.transactionId}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff', scrollY: 0 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        if (window.html2pdf) {
            window.html2pdf().set(opt).from(element).save();
        } else {
            message.error('PDF generation library is still loading. Please try again in a moment.');
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
                if (record.paymentStatus === 'PAID') {
                    if (record.paymentMethod === 'PAYPAL') return <Tag color="green">PAID (PayPal)</Tag>;
                    return <Tag color="green">PAID (Card)</Tag>;
                }
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
                    <Button
                        type="default"
                        icon={<FileTextOutlined />}
                        onClick={() => {
                            setReceiptData({
                                bookingId: record._id,
                                spaceName: record.spaceId?.name || 'Deleted Space',
                                address: record.spaceId?.location?.address || 'Unknown Address',
                                driverName: record.driverName,
                                vehicleNumber: record.vehicleNumber,
                                startTime: record.startTime,
                                endTime: record.endTime,
                                totalAmount: record.totalAmount,
                                bookedHours: record.bookedHours,
                                appliedRateDescription: record.appliedRateDescription || `Base Rate ($${(record.totalAmount / record.bookedHours).toFixed(2)}/hr)`,
                                transactionId: record.transactionId || record._id,
                                paymentStatus: record.paymentStatus
                            });
                        }}
                        className="text-gray-600 border-gray-300 hover:border-gray-500 bg-white hover:bg-gray-50 shadow-sm dark:text-gray-300 dark:border-slate-600 dark:hover:border-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        Receipt
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 px-6 transition-colors duration-300">
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="lazyOnload" />
            <div className="w-[80vw] max-w-[1600px] mx-auto">
                <div className="mb-8">
                    <Title level={2} className="m-0 dark:text-white transition-colors duration-300">My Dashboard</Title>
                    <Text className="text-gray-500 dark:text-slate-400 text-lg transition-colors duration-300">Manage your parking reservations and history.</Text>
                </div>

                <div className="w-full overflow-x-auto">
                    <Card className="rounded-2xl shadow-sm border-0 min-w-full dark:bg-slate-800 transition-colors duration-300 dashboard-card">
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
                </div>

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

                {/* Success Receipt Modal */}
                <Modal
                    title={<div className="text-center text-xl text-[#0a1f44] dark:text-white pb-2 border-b dark:border-slate-700">Booking Receipt</div>}
                    open={!!receiptData}
                    onCancel={() => setReceiptData(null)}
                    className="bg-white dark:bg-slate-900 overflow-hidden rounded-xl"
                    styles={{
                        content: { backgroundColor: 'var(--tw-prose-body, transparent)' },
                        header: { backgroundColor: 'transparent', borderBottom: '1px solid #334155' }
                    }}
                    footer={[
                        <Button
                            key="navigate"
                            type="default"
                            size="large"
                            icon={<EnvironmentOutlined />}
                            onClick={() => {
                                let destination = '';
                                if (receiptData?.spaceId?.location?.lat && receiptData?.spaceId?.location?.lng) {
                                    destination = `${receiptData.spaceId.location.lat},${receiptData.spaceId.location.lng}`;
                                } else if (receiptData?.address) {
                                    destination = encodeURIComponent(receiptData.address);
                                }

                                if (destination) {
                                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
                                }
                            }}
                            className="text-brand-600 border-brand-200 hover:border-brand-400 bg-brand-50 dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400 hover:!text-blue-300"
                        >
                            Navigate
                        </Button>,
                        <Button key="download" type="default" size="large" onClick={handleDownloadReceipt} icon={<DownloadOutlined />} className="dark:bg-slate-800 dark:border-slate-700 dark:text-white hover:!text-white hover:!border-slate-600">
                            Download PDF
                        </Button>,
                        <Button key="close" type="primary" size="large" onClick={() => setReceiptData(null)} className="bg-[#1363DF] hover:!bg-[#0A1A3F] dark:bg-blue-600 dark:hover:!bg-blue-700 border-none font-semibold">
                            Close
                        </Button>,
                    ]}
                    centered
                >
                    {receiptData && (
                        <div className="py-2 overflow-y-auto max-h-[70vh] -mx-4 px-4 custom-scrollbar">
                            <div id="receipt-content" className="p-4 bg-white" style={{ minHeight: '600px', width: '100%', color: 'black' }}>
                                <div className="text-center mb-6 mt-4">
                                    <Title level={3} className="text-[#1363DF] m-0">Smart<span className="text-gray-900">Park</span></Title>
                                    <p className="text-gray-600 m-0 text-sm mt-1">123 Market Street, Kandy Sri Lanka</p>
                                    <p className="text-gray-600 m-0 text-sm">
                                        Tel: <a href="tel:+940778880890" className="text-[#1363DF]" suppressHydrationWarning>+94 (077) 888-0890</a> | <a href="mailto:support@smartpark.com" className="text-[#1363DF]" suppressHydrationWarning>support@smartpark.com</a>
                                    </p>
                                </div>

                                <div className="flex justify-center mb-6">
                                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
                                        <QRCode value={receiptData.bookingId} size={160} color="#0a1f44" bgColor="transparent" />
                                        <Text className="text-xs text-gray-500 mt-2 font-mono">Scan on Arrival</Text>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                                        <span className="text-gray-600">Transaction ID</span>
                                        <span className="font-mono text-gray-800">{receiptData.transactionId}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                                        <span className="text-gray-600">Payment Status</span>
                                        {receiptData.paymentStatus === 'PAID'
                                            ? <Tag color="green" className="m-0 border-0 font-bold bg-green-50 text-green-700">PAID (Card)</Tag>
                                            : <Tag color="orange" className="m-0 border-0 font-bold bg-orange-50 text-orange-700">PENDING (Pay at Spot)</Tag>
                                        }
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                                        <span className="text-gray-600">Parking Space</span>
                                        <strong className="text-gray-900">{receiptData.spaceName}</strong>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                                        <span className="text-gray-600">Vehicle</span>
                                        <strong className="text-gray-900">{receiptData.vehicleNumber} ({receiptData.driverName})</strong>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                                        <span className="text-gray-600">Arrival</span>
                                        <span className="text-gray-900">{new Date(receiptData.startTime).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                                        <span className="text-gray-600">Duration</span>
                                        <strong className="text-gray-900">{receiptData.bookedHours} Hour(s)</strong>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                                        <span className="text-gray-600">Applied Rate</span>
                                        <span className="text-gray-800 italic">{receiptData.appliedRateDescription}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-200 pb-3 mb-3">
                                        <span className="text-gray-600">Departure</span>
                                        <span className="text-gray-900">{new Date(receiptData.endTime).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-700 font-medium">Total Amount</span>
                                        <strong className="text-[#1363DF] text-xl">${receiptData.totalAmount}</strong>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-300 text-center">
                                    <p className="text-xs text-gray-500 m-0 font-medium uppercase tracking-wider">Terms and Conditions</p>
                                    <p className="text-[10px] text-gray-500 m-0 mt-2 leading-relaxed px-4">
                                        Please retain this receipt for your records. SmartPark is not liable for theft or damage to vehicles. Vehicles left beyond the booked duration may be subject to towing or additional fees at the owner's discretion.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
