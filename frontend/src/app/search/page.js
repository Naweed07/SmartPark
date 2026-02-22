'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Input, DatePicker, Button, Modal, message, Tag } from 'antd';
import { EnvironmentOutlined, DollarOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Script from 'next/script';

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

    // Driver details state
    const [driverName, setDriverName] = useState('');
    const [driverEmail, setDriverEmail] = useState('');
    const [driverPhone, setDriverPhone] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');

    // Receipt state
    const [receiptData, setReceiptData] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetchSpaces();
    }, []);

    const handleDownloadReceipt = () => {
        const element = document.getElementById('receipt-content');
        if (!element) return;

        const opt = {
            margin: 0.3,
            filename: `SmartPark_Receipt_${receiptData.transactionId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        if (window.html2pdf) {
            window.html2pdf().set(opt).from(element).save();
        } else {
            message.error('PDF generation library is still loading. Please try again in a moment.');
        }
    };

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

        if (!driverName || !driverEmail || !driverPhone || !vehicleNumber) {
            message.error('Please fill in all driver and vehicle details');
            return;
        }

        setBookingLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        // Calculate tiered total mathematically
        // Use minutes and divide by 60, then ceil carefully so any partial hour counts as a full hour
        const exactHours = bookingRange[1].diff(bookingRange[0], 'minutes') / 60;
        const bookedHours = Math.max(1, Math.ceil(exactHours));

        let totalAmount = selectedSpace.rates.hourly; // Always charge base rate for 1 hour by default
        let appliedRateDescription = `Base Rate ($${selectedSpace.rates.hourly}/hr)`;

        if (bookedHours > 1) {
            let matchedTier = null;

            // Check if any custom tier matches the total booked hours
            if (selectedSpace.rates.customTiers && selectedSpace.rates.customTiers.length > 0) {
                matchedTier = selectedSpace.rates.customTiers.find(tier =>
                    bookedHours >= tier.minHours && bookedHours <= tier.maxHours
                );
            }

            if (matchedTier) {
                // Apply the matched tier rate to ALL hours
                totalAmount = bookedHours * matchedTier.rate;
                appliedRateDescription = `Tier: ${matchedTier.minHours}-${matchedTier.maxHours} hrs ($${matchedTier.rate}/hr)`;
            } else {
                // Fallback: charge all hours at base rate if no tier matches
                totalAmount = bookedHours * selectedSpace.rates.hourly;
            }
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
                    driverName,
                    driverEmail,
                    driverPhone,
                    vehicleNumber,
                    totalAmount,
                    bookedHours,
                    appliedRateDescription,
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

                // Show on-screen receipt
                setReceiptData({
                    spaceName: selectedSpace.name,
                    address: selectedSpace.location.address,
                    driverName,
                    vehicleNumber,
                    startTime: bookingRange[0].toISOString(),
                    endTime: bookingRange[1].toISOString(),
                    totalAmount,
                    bookedHours,
                    appliedRateDescription,
                    transactionId: payData.transactionId || `txn_${Date.now()}`
                });

                setBookingRange(null);
                setDriverName('');
                setDriverEmail('');
                setDriverPhone('');
                setVehicleNumber('');
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
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="lazyOnload" />
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
                                            <div className="text-xs text-brand-600 italic mt-2">*Discounted tier rate applies to the ENTIRE duration of your stay.</div>
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

                            <div className="mb-4 pt-4 border-t border-gray-100">
                                <p className="mb-3 font-medium text-gray-700">Driver & Vehicle Details:</p>
                                <Row gutter={12} className="mb-3">
                                    <Col span={12}>
                                        <Input placeholder="Full Name" size="large" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
                                    </Col>
                                    <Col span={12}>
                                        <Input placeholder="Email Address" size="large" type="email" value={driverEmail} onChange={(e) => setDriverEmail(e.target.value)} />
                                    </Col>
                                </Row>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Input placeholder="Phone Number" size="large" value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} />
                                    </Col>
                                    <Col span={12}>
                                        <Input placeholder="Vehicle License Plate" size="large" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
                                    </Col>
                                </Row>
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

                {/* Success Receipt Modal */}
                <Modal
                    title={<div className="text-center text-xl text-teal-600 pb-2 border-b">🎉 Booking Successful!</div>}
                    open={!!receiptData}
                    onCancel={() => setReceiptData(null)}
                    footer={[
                        <Button key="download" type="default" size="large" onClick={handleDownloadReceipt} icon={<DownloadOutlined />}>
                            Download PDF
                        </Button>,
                        <Button key="close" type="primary" size="large" onClick={() => setReceiptData(null)}>
                            Done
                        </Button>,
                    ]}
                    centered
                >
                    {receiptData && (
                        <div className="py-2" id="receipt-content">
                            <div className="text-center mb-6 mt-4">
                                <Title level={3} className="text-brand-600 m-0">Smart<span className="text-gray-900">Park</span></Title>
                                <p className="text-gray-500 m-0 text-sm mt-1">123 Market Street, Kandy Sri Lanka</p>
                                <p className="text-gray-500 m-0 text-sm">Tel: +94 (077) 888-0890 | support@smartpark.com</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <div className="flex justify-between border-b pb-3 mb-3">
                                    <span className="text-gray-500">Transaction ID</span>
                                    <span className="font-mono text-gray-700">{receiptData.transactionId}</span>
                                </div>
                                <div className="flex justify-between border-b pb-3 mb-3">
                                    <span className="text-gray-500">Amount Paid</span>
                                    <strong className="text-teal-600 text-lg">${receiptData.totalAmount}</strong>
                                </div>
                                <div className="flex justify-between border-b pb-3 mb-3">
                                    <span className="text-gray-500">Parking Space</span>
                                    <strong className="text-gray-800">{receiptData.spaceName}</strong>
                                </div>
                                <div className="flex justify-between border-b pb-3 mb-3">
                                    <span className="text-gray-500">Vehicle</span>
                                    <strong className="text-gray-800">{receiptData.vehicleNumber} ({receiptData.driverName})</strong>
                                </div>
                                <div className="flex justify-between border-b pb-3 mb-3">
                                    <span className="text-gray-500">Arrival</span>
                                    <span className="text-gray-800">{new Date(receiptData.startTime).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b pb-3 mb-3">
                                    <span className="text-gray-500">Duration</span>
                                    <strong className="text-gray-800">{receiptData.bookedHours} Hour(s)</strong>
                                </div>
                                <div className="flex justify-between border-b pb-3 mb-3">
                                    <span className="text-gray-500">Applied Rate</span>
                                    <span className="text-gray-700 italic">{receiptData.appliedRateDescription}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Departure</span>
                                    <span className="text-gray-800">{new Date(receiptData.endTime).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                                <p className="text-xs text-gray-400 m-0 font-medium uppercase tracking-wider">Terms and Conditions</p>
                                <p className="text-[10px] text-gray-400 m-0 mt-2 leading-relaxed px-4">
                                    Please retain this receipt for your records. SmartPark is not liable for theft or damage to vehicles. Vehicles left beyond the booked duration may be subject to towing or additional fees at the owner's discretion.
                                </p>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
}
