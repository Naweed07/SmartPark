'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Input, DatePicker, Button, Modal, message, Tag, Radio, Divider, QRCode } from 'antd';
import { EnvironmentOutlined, DollarOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import dayjs from 'dayjs';
import { getApiUrl } from '../../utils/api';

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

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('CARD');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');

    // Receipt state
    const [receiptData, setReceiptData] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            message.warning('Please log in or create an account to find parking.');
            router.push('/login');
            return;
        }
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

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        // Add dash every 4 characters
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) formattedValue += '-';
            formattedValue += value[i];
        }
        setCardNumber(formattedValue.slice(0, 19)); // Max 19 chars (16 digits + 3 dashes)
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        setCardExpiry(value.slice(0, 5)); // Max 5 chars (MM/YY)
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
            const res = await fetch(`${getApiUrl()}/spaces`);
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

    const handlePayPalApprove = async (data, actions) => {
        try {
            const details = await actions.order.capture();
            if (details.status === "COMPLETED") {
                // Manually trigger the booking now that PayPal is guaranteed paid
                await handleBook(true, details.id);
            }
        } catch (error) {
            message.error("PayPal payment could not be processed.");
        }
    };

    // Modified handleBook to accept a bypass flag for PayPal
    const handleBook = async (isPayPalApproved = false, paypalTransactionId = null) => {
        if (!bookingRange || bookingRange.length !== 2) {
            message.error('Please select a time range');
            return;
        }

        if (!driverName || !driverEmail || !driverPhone || !vehicleNumber) {
            message.error('Please fill in all driver and vehicle details');
            return;
        }

        if (paymentMethod === 'CARD' && (!cardNumber || !cardExpiry || !cardCVC)) {
            message.error('Please fill in the mock card details to process payment');
            return;
        }

        // Only show loading if we aren't in the middle of a PayPal popup
        if (!isPayPalApproved) setBookingLoading(true);

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        const exactHours = bookingRange[1].diff(bookingRange[0], 'minutes') / 60;
        const bookedHours = Math.max(1, Math.ceil(exactHours));

        let totalAmount = selectedSpace.rates.hourly;
        let appliedRateDescription = `Base Rate ($${selectedSpace.rates.hourly}/hr)`;

        if (bookedHours > 1) {
            let matchedTier = null;
            if (selectedSpace.rates.customTiers && selectedSpace.rates.customTiers.length > 0) {
                matchedTier = selectedSpace.rates.customTiers.find(tier =>
                    bookedHours >= tier.minHours && bookedHours <= tier.maxHours
                );
            }

            if (matchedTier) {
                totalAmount = bookedHours * matchedTier.rate;
                appliedRateDescription = `Tier: ${matchedTier.minHours}-${matchedTier.maxHours} hrs ($${matchedTier.rate}/hr)`;
            } else {
                totalAmount = bookedHours * selectedSpace.rates.hourly;
            }
        }

        // If paying with PayPal, we DO NOT create the booking until PayPal is approved
        if (paymentMethod === 'PAYPAL' && !isPayPalApproved) {
            // Do not proceed with handleBook. Let the PayPalButton handle the popup.
            return;
        }

        try {
            // 1. Create Booking
            const bookRes = await fetch(`${getApiUrl()}/bookings`, {
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
                    paymentMethod
                }),
            });

            const bookData = await bookRes.json();

            if (!bookRes.ok) {
                throw new Error(bookData.message || 'Booking failed');
            }

            // 2. Process mock card OR handle On-Site OR handle approved PayPal
            let transactionId = paypalTransactionId || `onsite_${Date.now()}`;
            let paymentSuccess = true;

            if (paymentMethod === 'CARD') {
                const payRes = await fetch(`${getApiUrl()}/payments/process`, {
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

                if (!payRes.ok || !payData.success) {
                    paymentSuccess = false;
                    message.error(payData.message || 'Payment declined by bank');
                } else {
                    transactionId = payData.transactionId;
                }
            }

            if (paymentSuccess) {
                let successMsg = `Booking reserved! Please pay $${totalAmount} on arrival.`;
                if (paymentMethod === 'CARD') successMsg = `Booking confirmed! Paid $${totalAmount} via Card.`;
                if (paymentMethod === 'PAYPAL') successMsg = `Booking confirmed! Paid $${totalAmount} via PayPal.`;
                message.success(successMsg);

                setIsModalVisible(false);

                // Show on-screen receipt
                setReceiptData({
                    bookingId: bookData._id,
                    spaceName: selectedSpace.name,
                    address: selectedSpace.location.address,
                    driverName,
                    vehicleNumber,
                    startTime: bookingRange[0].toISOString(),
                    endTime: bookingRange[1].toISOString(),
                    totalAmount,
                    bookedHours,
                    appliedRateDescription,
                    transactionId,
                    paymentStatus: (paymentMethod === 'CARD' || paymentMethod === 'PAYPAL') ? 'PAID' : 'PENDING'
                });

                setBookingRange(null);
                setDriverName('');
                setDriverEmail('');
                setDriverPhone('');
                setVehicleNumber('');
                setCardNumber('');
                setCardExpiry('');
                setCardCVC('');
            }

        } catch (error) {
            message.error(error.message);
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] md:bg-[#E6EDF2]/30 dark:bg-slate-900 md:dark:bg-slate-900/50 p-6 md:p-8 transition-colors duration-300">
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="lazyOnload" />
            <div className="max-w-7xl mx-auto pt-16">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <Title level={2} className="m-0 text-[#0A1A3F] dark:text-white font-extrabold tracking-tight transition-colors duration-300">Find Parking</Title>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Input
                            prefix={<SearchOutlined className="text-gray-400 dark:text-slate-400" />}
                            placeholder="Enter destination or area..."
                            size="large"
                            className="w-full md:w-80 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-[#1363DF] dark:focus:border-[#1363DF] transition-colors duration-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onPressEnter={handleSearch}
                        />
                        <Button type="primary" size="large" className="rounded-xl px-8 bg-[#1363DF] hover:!bg-[#0A1A3F] border-none shadow-md hover:shadow-lg transition-all font-semibold search-btn-s" onClick={handleSearch}>Search</Button>
                    </div>
                </div>

                {/* Interactive Leaflet Map */}
                <div className="w-full h-[600px] bg-white dark:bg-slate-800 rounded-[2rem] mb-12 border border-gray-100 dark:border-slate-700 shadow-[0_10px_40px_rgba(10,26,63,0.05)] relative z-0 overflow-hidden transform transition-all duration-300">
                    <MapWithNoSSR spaces={spaces} onBookSpace={showBookingModal} searchedLocation={searchedLocation} />
                </div>

                <Row gutter={[24, 24]}>
                    {spaces.map(space => (
                        <Col xs={24} sm={12} lg={8} key={space._id}>
                            <Card
                                hoverable
                                className="rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-[0_20px_40px_rgba(10,26,63,0.08)] transition-all h-full flex flex-col group"
                                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <Title level={4} className="m-0 text-[#0A1A3F] dark:text-white font-bold leading-tight group-hover:text-[#1363DF] transition-colors">{space.name}</Title>
                                    <div className="flex flex-col items-end">
                                        <Tag className="rounded-full px-3 py-1 font-bold m-0 bg-[#1363DF]/10 dark:bg-[#1363DF]/20 text-[#1363DF] dark:text-[#3b82f6] border-0">${space.rates.hourly}/1st hr</Tag>
                                        {(space.rates.customTiers && space.rates.customTiers.length > 0) && (
                                            <div className="text-[10px] text-gray-500 dark:text-slate-400 mt-2 pr-1 font-medium bg-gray-50 dark:bg-slate-700/50 px-2 py-0.5 rounded border border-gray-100 dark:border-slate-600/50 text-right w-full">
                                                {space.rates.customTiers.map((t, i) => (
                                                    <div key={i}>{t.minHours}-{t.maxHours} hrs: ${t.rate}/hr</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="text-gray-500 dark:text-slate-400 mb-6 flex items-start gap-2 flex-1 font-medium">
                                    <EnvironmentOutlined className="mt-1 text-[#1363DF] dark:text-[#3b82f6]" />
                                    <span>{space.location.address}</span>
                                </div>

                                <div className="flex justify-between items-center mt-auto pt-5 border-t border-gray-100 dark:border-slate-700">
                                    <div className="text-sm text-gray-400 dark:text-slate-500 font-medium">
                                        Capacity: <strong className="text-gray-600 dark:text-slate-300">{space.capacity}</strong> slots
                                    </div>
                                    <Button type="primary" className="rounded-full px-6 bg-[#1363DF] hover:!bg-[#0A1A3F] border-none shadow-md hover:shadow-lg booknow-btn transition-all font-semibold" onClick={() => showBookingModal(space)}>
                                        Book Now
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal
                    title={<span className="dark:text-white">{selectedSpace ? `Book ${selectedSpace.name}` : 'Book Space'}</span>}
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden"
                    styles={{
                        content: { backgroundColor: 'var(--tw-prose-body, transparent)' },
                        header: { backgroundColor: 'transparent', borderBottom: '1px solid #334155' }
                    }}
                    footer={
                        // We conditionally hide the natural 'Confirm & Pay' button 
                        // if PayPal is selected, because PayPal brings its own buttons!
                        paymentMethod === 'PAYPAL' ? [
                            <Button key="back" onClick={() => setIsModalVisible(false)} className="rounded-lg font-medium dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:!text-white hover:!border-slate-600">Cancel</Button>
                        ] : [
                            <Button key="back" onClick={() => setIsModalVisible(false)} className="rounded-lg font-medium dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:!text-white hover:!border-slate-600">Cancel</Button>,
                            <Button key="submit" type="primary" loading={bookingLoading} onClick={() => handleBook()} className="bg-[#1363DF] hover:!bg-[#0A1A3F] dark:bg-blue-600 dark:hover:!bg-blue-700 border-none rounded-lg shadow-md transition-all font-semibold">
                                Confirm & Pay
                            </Button>,
                        ]}
                >
                    {selectedSpace && (
                        <div className="py-4 overflow-y-auto max-h-[70vh] px-2 -mx-2">
                            <div className="flex justify-between mb-4 text-base">
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between w-full dark:text-slate-300">
                                        <span>Base Rate: <strong className="text-[#1363DF] dark:text-[#3b82f6]">${selectedSpace.rates.hourly}</strong> (1st hour)</span>
                                        <span className="text-right text-gray-600 dark:text-slate-400"><EnvironmentOutlined /> {selectedSpace.location.address}</span>
                                    </div>

                                    {(selectedSpace.rates.customTiers && selectedSpace.rates.customTiers.length > 0) && (
                                        <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm border border-gray-100 dark:border-slate-700">
                                            <strong className="text-gray-700 dark:text-slate-200 block mb-1">Discounted Pricing Tiers:</strong>
                                            {selectedSpace.rates.customTiers.map((tier, idx) => (
                                                <div key={idx} className="flex justify-between text-gray-600 dark:text-slate-400 mb-0.5">
                                                    <span>If staying {tier.minHours} to {tier.maxHours} total hours:</span>
                                                    <strong className="text-[#1363DF] dark:text-[#3b82f6]">${tier.rate}/hr</strong>
                                                </div>
                                            ))}
                                            <div className="text-xs text-[#1363DF] dark:text-[#3b82f6] italic mt-2">*Discounted tier rate applies to the ENTIRE duration of your stay.</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="mb-2 font-medium text-gray-700 dark:text-slate-300">Select Time Range:</p>
                                <RangePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    className="w-full rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    popupClassName="dark:bg-slate-800"
                                    size="large"
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                    disabledTime={(date, type) => {
                                        if (!date) return {};
                                        // Disable past times on the current day
                                        if (date.isSame(dayjs(), 'day')) {
                                            const currentHour = dayjs().hour();
                                            const currentMinute = dayjs().minute();
                                            return {
                                                disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
                                                disabledMinutes: (selectedHour) => selectedHour === currentHour ? Array.from({ length: currentMinute }, (_, i) => i) : [],
                                            };
                                        }
                                        return {};
                                    }}
                                    onChange={(dates) => setBookingRange(dates)}
                                />
                            </div>

                            <div className="mb-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                                <p className="mb-3 font-medium text-gray-700 dark:text-slate-300">Driver & Vehicle Details:</p>
                                <Row gutter={12} className="mb-3">
                                    <Col span={12}>
                                        <Input placeholder="Full Name" size="large" className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
                                    </Col>
                                    <Col span={12}>
                                        <Input placeholder="Email Address" size="large" type="email" className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={driverEmail} onChange={(e) => setDriverEmail(e.target.value)} />
                                    </Col>
                                </Row>
                                <Row gutter={12}>
                                    <Col span={12}>
                                        <Input placeholder="Phone Number" size="large" className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} />
                                    </Col>
                                    <Col span={12}>
                                        <Input placeholder="Vehicle License Plate" size="large" className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
                                    </Col>
                                </Row>
                            </div>

                            <div className="mb-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                                <p className="mb-3 font-medium text-gray-700 dark:text-slate-300">Payment Option:</p>
                                <Radio.Group
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    value={paymentMethod}
                                    className="w-full mb-4 flex flex-col sm:flex-row gap-2"
                                >
                                    <Radio.Button value="CARD" className="flex-1 text-center h-auto py-2 rounded-lg flex flex-col items-center justify-center dark:bg-slate-800 dark:border-slate-700 [&.ant-radio-button-wrapper-checked]:dark:bg-blue-900/30">
                                        <Text strong className="block mb-1 dark:text-white transition-colors">Pay Now (Card)</Text>
                                        <Text type="secondary" className="text-[10px] dark:text-slate-400">Mock API</Text>
                                    </Radio.Button>
                                    <Radio.Button value="PAYPAL" className="flex-1 text-center h-auto py-2 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 rounded-lg flex flex-col items-center justify-center">
                                        <Text strong className="block mb-1 text-blue-800 dark:text-blue-300">PayPal</Text>
                                        <Text type="secondary" className="text-[10px] dark:text-blue-400/70">Official Integration</Text>
                                    </Radio.Button>
                                    <Radio.Button value="ON_SITE" className="flex-1 text-center h-auto py-2 rounded-lg flex flex-col items-center justify-center dark:bg-slate-800 dark:border-slate-700 [&.ant-radio-button-wrapper-checked]:dark:bg-blue-900/30">
                                        <Text strong className="block mb-1 dark:text-white transition-colors">Pay at Spot</Text>
                                        <Text type="secondary" className="text-[10px] dark:text-slate-400">Pay on arrival</Text>
                                    </Radio.Button>
                                </Radio.Group>

                                {paymentMethod === 'CARD' && (
                                    <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 animate-fade-in-up">
                                        <div className="flex justify-between items-center mb-3">
                                            <Text strong className="text-gray-600 dark:text-slate-300">Mock Card Details</Text>
                                            <Tag color="cyan" className="dark:bg-cyan-900/30 dark:border-cyan-800">Testing Mode</Tag>
                                        </div>
                                        <Input
                                            placeholder="Card Number (e.g. 4242-4242-4242-4242)"
                                            size="large"
                                            className="mb-3 font-mono dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                            maxLength={19}
                                            value={cardNumber}
                                            onChange={handleCardNumberChange}
                                        />
                                        <Row gutter={12}>
                                            <Col span={12}>
                                                <Input
                                                    placeholder="MM/YY"
                                                    size="large"
                                                    maxLength={5}
                                                    className="font-mono text-center dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                                    value={cardExpiry}
                                                    onChange={handleExpiryChange}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <Input
                                                    placeholder="CVC"
                                                    size="large"
                                                    maxLength={3}
                                                    className="font-mono text-center dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                                    value={cardCVC}
                                                    onChange={(e) => setCardCVC(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                )}

                                {paymentMethod === 'PAYPAL' && (
                                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 animate-fade-in-up">
                                        <div className="flex justify-between items-center mb-4">
                                            <Text strong className="text-gray-600 dark:text-slate-300">Secure Checkout w/ PayPal</Text>
                                            <Tag color="cyan" className="dark:bg-cyan-900/30 dark:border-cyan-800">Sandbox Environment</Tag>
                                        </div>
                                        {/* Dynamically calculate totalAmount again for the PayPal order creation */}
                                        {(() => {
                                            const exactHours = bookingRange && bookingRange.length === 2 ? bookingRange[1].diff(bookingRange[0], 'minutes') / 60 : 0;
                                            const bookedHours = Math.max(1, Math.ceil(exactHours));

                                            let currentTotal = selectedSpace.rates.hourly;
                                            if (bookedHours > 1) {
                                                let matchedTier = null;
                                                if (selectedSpace.rates.customTiers && selectedSpace.rates.customTiers.length > 0) {
                                                    matchedTier = selectedSpace.rates.customTiers.find(tier => bookedHours >= tier.minHours && bookedHours <= tier.maxHours);
                                                }
                                                if (matchedTier) currentTotal = bookedHours * matchedTier.rate;
                                                else currentTotal = bookedHours * selectedSpace.rates.hourly;
                                            }

                                            return (
                                                <PayPalScriptProvider options={{ "client-id": "test", currency: "USD", intent: "capture" }}>
                                                    <PayPalButtons
                                                        forceReRender={[currentTotal, isModalVisible]}
                                                        style={{ layout: "vertical", color: "blue", shape: "rect", label: "checkout" }}
                                                        createOrder={(data, actions) => {
                                                            if (!driverName || !driverEmail || !vehicleNumber || !bookingRange) {
                                                                message.error('Please fill in all details before proceeding with PayPal');
                                                                return actions.reject();
                                                            }
                                                            return actions.order.create({
                                                                purchase_units: [{
                                                                    amount: {
                                                                        value: currentTotal.toString()
                                                                    }
                                                                }]
                                                            });
                                                        }}
                                                        onApprove={handlePayPalApprove}
                                                    />
                                                </PayPalScriptProvider>
                                            );
                                        })()}
                                    </div>
                                )}

                                {paymentMethod === 'ON_SITE' && (
                                    <div className="bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-blue-700 dark:text-blue-300 animate-fade-in-up">
                                        <p className="m-0 font-medium">Your slot will be reserved immediately!</p>
                                        <p className="m-0 text-sm mt-1 dark:text-blue-400">Please ensure you pay the owner directly upon arriving at the location. The owner may cancel your reservation if you do not arrive on time.</p>
                                    </div>
                                )}
                            </div>

                            {selectedSpace.rules && (
                                <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mt-4 border border-orange-100 dark:border-orange-800/50">
                                    <Text strong className="text-orange-800 dark:text-orange-300">Rules:</Text>
                                    <p className="text-orange-600 dark:text-orange-400/80 m-0 mt-1">{selectedSpace.rules}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>

                {/* Success Receipt Modal */}
                <Modal
                    title={<div className="text-center text-xl text-[#0a1f44] dark:text-white pb-2 border-b dark:border-slate-700">🎉 Booking Successful!</div>}
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
                            Done
                        </Button>,
                    ]}
                    centered
                >
                    {receiptData && (
                        <div className="py-2 overflow-y-auto max-h-[70vh] px-2 -mx-2" id="receipt-content">
                            <div className="text-center mb-6 mt-4">
                                <Title level={3} className="text-[#1363DF] dark:text-[#3b82f6] m-0">Smart<span className="text-gray-900 dark:text-white">Park</span></Title>
                                <p className="text-gray-500 dark:text-slate-400 m-0 text-sm mt-1">123 Market Street, Kandy Sri Lanka</p>
                                <p className="text-gray-500 dark:text-slate-400 m-0 text-sm">
                                    Tel: <a href="tel:+940778880890" className="text-[#1363DF] dark:text-[#3b82f6] hover:text-[#0A1A3F] dark:hover:text-[#60a5fa]" suppressHydrationWarning>+94 (077) 888-0890</a> | <a href="mailto:support@smartpark.com" className="text-[#1363DF] dark:text-[#3b82f6] hover:text-[#0A1A3F] dark:hover:text-[#60a5fa]" suppressHydrationWarning>support@smartpark.com</a>
                                </p>
                            </div>

                            <div className="flex justify-center mb-6">
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center">
                                    <QRCode value={receiptData.bookingId} size={160} color="#0a1f44" bgColor="transparent" />
                                    <Text className="text-xs text-gray-400 dark:text-slate-400 mt-2 font-mono">Scan on Arrival</Text>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                                <div className="flex justify-between border-b dark:border-slate-700 pb-3 mb-3">
                                    <span className="text-gray-500 dark:text-slate-400">Transaction ID</span>
                                    <span className="font-mono text-gray-700 dark:text-slate-300">{receiptData.transactionId}</span>
                                </div>
                                <div className="flex justify-between border-b dark:border-slate-700 pb-3 mb-3">
                                    <span className="text-gray-500 dark:text-slate-400">Payment Status</span>
                                    {receiptData.paymentStatus === 'PAID'
                                        ? <Tag color="green" className="m-0 border-0 font-bold dark:bg-green-900/30 dark:text-green-400">PAID (Card)</Tag>
                                        : <Tag color="orange" className="m-0 border-0 font-bold dark:bg-orange-900/30 dark:text-orange-400">PENDING (Pay at Spot)</Tag>
                                    }
                                </div>
                                <div className="flex justify-between border-b dark:border-slate-700 pb-3 mb-3">
                                    <span className="text-gray-500 dark:text-slate-400">Parking Space</span>
                                    <strong className="text-gray-800 dark:text-white">{receiptData.spaceName}</strong>
                                </div>
                                <div className="flex justify-between border-b dark:border-slate-700 pb-3 mb-3">
                                    <span className="text-gray-500 dark:text-slate-400">Vehicle</span>
                                    <strong className="text-gray-800 dark:text-white">{receiptData.vehicleNumber} ({receiptData.driverName})</strong>
                                </div>
                                <div className="flex justify-between border-b dark:border-slate-700 pb-3 mb-3">
                                    <span className="text-gray-500 dark:text-slate-400">Arrival</span>
                                    <span className="text-gray-800 dark:text-white">{new Date(receiptData.startTime).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b dark:border-slate-700 pb-3 mb-3">
                                    <span className="text-gray-500 dark:text-slate-400">Duration</span>
                                    <strong className="text-gray-800 dark:text-white">{receiptData.bookedHours} Hour(s)</strong>
                                </div>
                                <div className="flex justify-between border-b dark:border-slate-700 pb-3 mb-3">
                                    <span className="text-gray-500 dark:text-slate-400">Applied Rate</span>
                                    <span className="text-gray-700 dark:text-slate-300 italic">{receiptData.appliedRateDescription}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-slate-400">Departure</span>
                                    <span className="text-gray-800 dark:text-white">{new Date(receiptData.endTime).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 text-center">
                                <p className="text-xs text-gray-400 dark:text-slate-500 m-0 font-medium uppercase tracking-wider">Terms and Conditions</p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 m-0 mt-2 leading-relaxed px-4">
                                    Please retain this receipt for your records. SmartPark is not liable for theft or damage to vehicles. Vehicles left beyond the booked duration may be subject to towing or additional fees at the owner's discretion.
                                </p>
                            </div>
                        </div>
                    )}
                </Modal>
            </div >
        </div >
    );
}
