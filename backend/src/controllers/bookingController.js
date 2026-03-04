import Booking from '../models/Booking.js';
import ParkingSpace from '../models/ParkingSpace.js';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import { sendBookingConfirmation } from '../utils/twilioService.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { spaceId, startTime, endTime, totalAmount, driverName, driverPhone, driverEmail, vehicleNumber, bookedHours, appliedRateDescription, paymentMethod } = req.body;

    if (!spaceId || !startTime || !endTime || !totalAmount || !driverName || !driverPhone || !driverEmail || !vehicleNumber || !paymentMethod) {
        res.status(400).json({ message: 'All booking fields and payment method are required' });
        return;
    }

    const space = await ParkingSpace.findById(spaceId);

    if (!space) {
        res.status(404).json({ message: 'Parking space not found' });
        return;
    }

    // Basic check for overlapping bookings
    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);

    const overlappingBookings = await Booking.find({
        spaceId,
        status: { $in: ['PENDING', 'CONFIRMED'] },
        $or: [
            { startTime: { $lt: parsedEndTime }, endTime: { $gt: parsedStartTime } }
        ]
    });

    if (overlappingBookings.length >= space.capacity) {
        res.status(400).json({ message: 'Space is fully booked for this time period' });
        return;
    }

    const booking = new Booking({
        driverId: req.user._id,
        spaceId,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        driverName,
        driverPhone,
        driverEmail,
        vehicleNumber,
        totalAmount,
        bookedHours,
        appliedRateDescription,
        status: 'CONFIRMED', // Auto-confirming the reservation itself
        paymentMethod: paymentMethod,
        paymentStatus: (paymentMethod === 'ON_SITE' || paymentMethod === 'CARD') ? 'PENDING' : 'PAID', // Card and OnSite start pending. PayPal is only hit post-approval.
    });

    const createdBooking = await booking.save();

    // Generate QR Code Data URI
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(createdBooking._id.toString());
        createdBooking.qrCodeUrl = qrCodeDataUrl;
        await createdBooking.save();
    } catch (err) {
        console.error('Failed to generate QR code:', err);
    }

    // Fire off WhatsApp/SMS Booking Confirmation via Twilio
    await sendBookingConfirmation(driverPhone, createdBooking);

    // Fire off Email Confirmation Receipt via Nodemailer (Ethereal test logs if no .env SMTP)
    try {
        const startDateStr = new Date(createdBooking.startTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
        const endDateStr = new Date(createdBooking.endTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h2 style="color: #1363DF;">SmartPark Booking Confirmed! 🚗</h2>
                <p>Hi ${driverName},</p>
                <p>Your parking space has been successfully reserved. Here are your booking details:</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                    <p><strong>Booking ID:</strong> ${createdBooking._id}</p>
                    <p><strong>Location:</strong> ${space.name} - ${space.location.address}</p>
                    <p><strong>Vehicle:</strong> ${vehicleNumber}</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;">
                    <p><strong>Arrive:</strong> ${startDateStr}</p>
                    <p><strong>Depart:</strong> ${endDateStr}</p>
                    <p><strong>Total Paid:</strong> $${totalAmount}</p>
                </div>
                
                <p>Please keep this email for your records. If you selected 'Pay at Spot', please ensure you pay the owner upon arrival.</p>
                <p>Thank you for using SmartPark!</p>
            </div>
        `;

        await sendEmail({
            to: driverEmail,
            subject: "Your SmartPark Booking Receipt",
            html: emailHtml
        });
    } catch (emailErr) {
        console.error("Failed to trigger email receipt:", emailErr);
    }

    res.status(201).json(createdBooking);
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate('driverId', 'name email')
        .populate('spaceId', 'name location rates');

    if (booking) {
        res.json(booking);
    } else {
        res.status(404).json({ message: 'Booking not found' });
    }
};

// @desc    Get logged in driver's bookings
// @route   GET /api/bookings/my
// @access  Private
const getDriverBookings = async (req, res) => {
    const bookings = await Booking.find({ driverId: req.user._id }).populate('spaceId', 'name location rates');
    res.json(bookings);
};

// @desc    Get bookings for a specific space (Owner)
// @route   GET /api/bookings/space/:spaceId
// @access  Private/Owner
const getSpaceBookings = async (req, res) => {
    const space = await ParkingSpace.findById(req.params.spaceId);

    if (!space) {
        res.status(404).json({ message: 'Parking space not found' });
        return;
    }

    if (space.ownerId.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized for this space' });
        return;
    }

    const bookings = await Booking.find({ spaceId: req.params.spaceId }).populate('driverId', 'name email');
    res.json(bookings);
};

// @desc    Get aggregated metrics for the logged in Owner
// @route   GET /api/bookings/metrics/owner
// @access  Private/Owner
const getOwnerMetrics = async (req, res) => {
    // 1. Find all parking spaces owned by this user
    const ownerSpaces = await ParkingSpace.find({ ownerId: req.user._id }).select('_id name');
    const spaceIds = ownerSpaces.map(space => space._id);

    // 2. Aggregate active bookings against those spaces
    // 'CONFIRMED' bookings that haven't ended yet
    const now = new Date();
    const activeBookingsCount = await Booking.countDocuments({
        spaceId: { $in: spaceIds },
        status: 'CONFIRMED',
        endTime: { $gte: now }
    });

    // 3. Aggregate total revenue across all time for those spaces
    const revenueResult = await Booking.aggregate([
        {
            $match: {
                spaceId: { $in: spaceIds },
                status: 'CONFIRMED' // Only count paid/confirmed bookings
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" }
            }
        }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const daysStr = req.query.days;
    const daysToAggr = daysStr ? parseInt(daysStr, 10) : 7;

    // 4. Aggregate revenue by day for the last X days (for Line Chart)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToAggr + 1);
    startDate.setHours(0, 0, 0, 0);

    const revenueByDayResult = await Booking.aggregate([
        {
            $match: {
                spaceId: { $in: spaceIds },
                status: 'CONFIRMED',
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: "$totalAmount" }
            }
        },
        {
            $sort: { "_id": 1 }
        }
    ]);

    // Format for Recharts (fill in missing days with 0)
    const revenueByDay = [];
    for (let i = 0; i < daysToAggr; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        const dateString = d.toISOString().split('T')[0];
        const match = revenueByDayResult.find(r => r._id === dateString);
        revenueByDay.push({
            date: dateString,
            revenue: match ? match.revenue : 0
        });
    }

    // 5. Aggregate bookings by space (for Pie Chart)
    const bookingsBySpaceResult = await Booking.aggregate([
        {
            $match: {
                spaceId: { $in: spaceIds },
                status: 'CONFIRMED'
            }
        },
        {
            $group: {
                _id: "$spaceId",
                bookings: { $sum: 1 }
            }
        }
    ]);

    // Map the spaceId back to the space name
    const spaceMap = new Map();
    ownerSpaces.forEach(space => {
        spaceMap.set(space._id.toString(), space.name);
    });

    const bookingsBySpace = bookingsBySpaceResult.map(item => ({
        name: spaceMap.get(item._id.toString()) || 'Unknown Space',
        value: item.bookings
    }));

    res.json({
        activeBookings: activeBookingsCount,
        totalRevenue: totalRevenue,
        revenueByDay: revenueByDay,
        bookingsBySpace: bookingsBySpace
    });
};

// @desc    Get all bookings for all spaces owned by logged in Owner
// @route   GET /api/bookings/owner
// @access  Private/Owner
const getOwnerBookings = async (req, res) => {
    // 1. Find all parking spaces owned by this user
    const ownerSpaces = await ParkingSpace.find({ ownerId: req.user._id }).select('_id name location rates');
    const spaceIds = ownerSpaces.map(space => space._id);

    // 2. Find all bookings for those spaces
    const bookings = await Booking.find({ spaceId: { $in: spaceIds } })
        .populate('spaceId', 'name location')
        .sort({ createdAt: -1 }); // Newest first

    res.json(bookings);
};

// @desc    Check-in Driver via QR Code Scan (Owner)
// @route   POST /api/bookings/check-in
// @access  Private/Owner
const checkInBooking = async (req, res) => {
    const { bookingId } = req.body;

    if (!bookingId) {
        return res.status(400).json({ message: 'Booking ID is required' });
    }

    try {
        const booking = await Booking.findById(bookingId).populate('spaceId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.spaceId.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized for this space' });
        }

        if (booking.checkInStatus === 'CHECKED_IN') {
            return res.status(400).json({ message: 'Driver is already checked in' });
        }

        booking.checkInStatus = 'CHECKED_IN';
        await booking.save();

        res.json({ message: 'Driver successfully checked in', booking });
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ message: 'Server error during check-in' });
    }
};

export { createBooking, getBookingById, getDriverBookings, getSpaceBookings, getOwnerMetrics, getOwnerBookings, checkInBooking };
