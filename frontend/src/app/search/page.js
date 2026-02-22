'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Input, DatePicker, Button, Modal, message, Tag } from 'antd';
import { EnvironmentOutlined, DollarOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('../../components/MapComponent'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full"><Text className="text-gray-500">Loading Map...</Text></div>
});

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function SearchSpaces() {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [bookingRange, setBookingRange] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedLocation, setSearchedLocation] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetchSpaces();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            message.loading({ content: 'Searching location...', key: 'search' });
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setSearchedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                message.success({ content: 'Location found!', key: 'search' });
            } else {
                message.error({ content: 'Location not found', key: 'search' });
            }
        } catch (error) {
            message.error({ content: 'Error searching location', key: 'search' });
        }
    };

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

        // Calculate tiered total mathematically
        const hours = bookingRange[1].diff(bookingRange[0], 'hours');
        const bookedHours = Math.max(1, hours);

        let totalAmount = selectedSpace.rates.hourly; // Always charge base rate for hour 1

        if (bookedHours > 1) {
            let matchedTier = null;

            // Check if any custom tier matches the total booked hours
            if (selectedSpace.rates.customTiers && selectedSpace.rates.customTiers.length > 0) {
                // Find a tier using reverse to allow later overrides or just finding the first matching bracket. 
                // A better approach is to check minHours <= bookedHours && maxHours >= bookedHours
                matchedTier = selectedSpace.rates.customTiers.find(tier =>
                    bookedHours >= tier.minHours && bookedHours <= tier.maxHours
                );
            }

            // Charge the remaining hours at the matched tier rate OR fallback to the base hourly rate
            const additionalHoursRate = matchedTier ? matchedTier.rate : selectedSpace.rates.hourly;
            totalAmount += ((bookedHours - 1) * additionalHoursRate);
        }

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
                            placeholder="Search location (e.g., London)..."
                            size="large"
                            className="w-full md:w-64 rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onPressEnter={handleSearch}
                        />
                        <Button type="primary" size="large" className="rounded-lg" onClick={handleSearch}>Search</Button>
                    </div>
                </div>

                {/* Interactive Leaflet Map */}
                <div className="w-full h-[400px] bg-white rounded-2xl mb-8 border border-gray-100 shadow-sm relative z-0 overflow-hidden">
                    <MapWithNoSSR spaces={spaces} onBookSpace={showBookingModal} searchedLocation={searchedLocation} />
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
                                    <div className="flex flex-col items-end">
                                        <Tag color="cyan" className="rounded-full px-3 py-1 font-semibold m-0">${space.rates.hourly}/1st hr</Tag>
                                        {(space.rates.customTiers && space.rates.customTiers.length > 0) && (
                                            <div className="text-[10px] text-gray-500 mt-1 pr-1 font-medium bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-right w-full">
                                                {space.rates.customTiers.map((t, i) => (
                                                    <div key={i}>{t.minHours}-{t.maxHours} hrs: ${t.rate}/hr</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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
                            <div className="flex justify-between mb-4 text-base">
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between w-full">
                                        <span>Base Rate: <strong className="text-brand-600">${selectedSpace.rates.hourly}</strong> (1st hour)</span>
                                        <span className="text-right text-gray-600"><EnvironmentOutlined /> {selectedSpace.location.address}</span>
                                    </div>

                                    {(selectedSpace.rates.customTiers && selectedSpace.rates.customTiers.length > 0) && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                                            <strong className="text-gray-700 block mb-1">Discounted Pricing Tiers:</strong>
                                            {selectedSpace.rates.customTiers.map((tier, idx) => (
                                                <div key={idx} className="flex justify-between text-gray-600 mb-0.5">
                                                    <span>If staying {tier.minHours} to {tier.maxHours} total hours:</span>
                                                    <strong className="text-brand-600">${tier.rate}/hr</strong>
                                                </div>
                                            ))}
                                            <div className="text-xs text-brand-600 italic mt-2">*Discounted rate applies to remaining hours after the 1st hour</div>
                                        </div>
                                    )}
                                </div>
                            </div>

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
