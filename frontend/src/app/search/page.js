'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Input, DatePicker, Button, Modal, message, Tag } from 'antd';
import { EnvironmentOutlined, DollarOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function SearchSpaces() {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [bookingRange, setBookingRange] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchSpaces();
    }, []);

    const fetchSpaces = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/spaces');
            const data = await res.json();
            setSpaces(data);
        } catch (error) {
            message.error('Failed to load parking spaces');
        } finally {
            setLoading(false);
        }
    };

    const showBookingModal = (space) => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            message.warning('Please log in to book a space');
            router.push('/login');
            return;
        }
        setSelectedSpace(space);
        setIsModalVisible(true);
    };

    const handleBook = async () => {
        if (!bookingRange || bookingRange.length !== 2) {
            message.error('Please select a time range');
            return;
        }

        setBookingLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        // Calculate mock total (hours * hourly rate)
        const hours = bookingRange[1].diff(bookingRange[0], 'hours');
        const totalAmount = Math.max(1, hours) * selectedSpace.rates.hourly;

        try {
            // 1. Create Booking
            const bookRes = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    spaceId: selectedSpace._id,
                    startTime: bookingRange[0].toISOString(),
                    endTime: bookingRange[1].toISOString(),
                    totalAmount,
                }),
            });

            const bookData = await bookRes.json();

            if (!bookRes.ok) {
                throw new Error(bookData.message || 'Booking failed');
            }

            // 2. Process Mock Payment
            const payRes = await fetch('http://localhost:5000/api/payments/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    bookingId: bookData._id,
                }),
            });

            const payData = await payRes.json();

            if (payRes.ok && payData.success) {
                message.success(`Booking confirmed! Paid $${totalAmount}`);
                setIsModalVisible(false);
                setBookingRange(null);
            } else {
                message.error(payData.message || 'Payment failed');
            }

        } catch (error) {
            message.error(error.message);
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <Title level={2} className="m-0">Find Parking</Title>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search location..."
                            size="large"
                            className="w-full md:w-64 rounded-lg"
                        />
                        <Button type="primary" size="large" className="rounded-lg">Search</Button>
                    </div>
                </div>

                {/* Note: Map integration is mocked for MVP simplicity */}
                <div className="w-full h-64 bg-gray-200 rounded-2xl mb-8 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Text className="text-gray-500 text-lg flex items-center gap-2"><EnvironmentOutlined /> Interactive Map View (Mock)</Text>
                </div>

                <Row gutter={[24, 24]}>
                    {spaces.map(space => (
                        <Col xs={24} sm={12} lg={8} key={space._id}>
                            <Card
                                hoverable
                                className="rounded-2xl overflow-hidden border-0 shadow-sm hover:shadow-xl transition-shadow h-full flex flex-col"
                                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <Title level={4} className="m-0">{space.name}</Title>
                                    <Tag color="cyan" className="rounded-full px-3 py-1 font-semibold">${space.rates.hourly}/hr</Tag>
                                </div>

                                <div className="text-gray-500 mb-4 flex items-start gap-2 flex-1">
                                    <EnvironmentOutlined className="mt-1" />
                                    <span>{space.location.address}</span>
                                </div>

                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                    <div className="text-sm text-gray-400">
                                        Capacity: {space.capacity} slots
                                    </div>
                                    <Button type="primary" className="rounded-full px-6" onClick={() => showBookingModal(space)}>
                                        Book Now
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal
                    title={selectedSpace ? `Book ${selectedSpace.name}` : 'Book Space'}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setIsModalVisible(false)}>Cancel</Button>,
                        <Button key="submit" type="primary" loading={bookingLoading} onClick={handleBook}>
                            Confirm & Pay
                        </Button>,
                    ]}
                >
                    {selectedSpace && (
                        <div className="py-4">
                            <p className="flex justify-between mb-4 text-lg">
                                <span>Rate: <strong className="text-brand-600">${selectedSpace.rates.hourly}/hr</strong></span>
                                <span><EnvironmentOutlined /> {selectedSpace.location.address}</span>
                            </p>

                            <div className="mb-4">
                                <p className="mb-2 font-medium text-gray-700">Select Time Range:</p>
                                <RangePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    className="w-full rounded-lg"
                                    size="large"
                                    onChange={(dates) => setBookingRange(dates)}
                                />
                            </div>

                            {selectedSpace.rules && (
                                <div className="bg-orange-50 p-4 rounded-lg mt-4 border border-orange-100">
                                    <Text strong className="text-orange-800">Rules:</Text>
                                    <p className="text-orange-600 m-0 mt-1">{selectedSpace.rules}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
