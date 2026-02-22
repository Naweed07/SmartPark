import Booking from '../models/Booking.js';
import ParkingSpace from '../models/ParkingSpace.js';
import mongoose from 'mongoose';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { spaceId, startTime, endTime, totalAmount, driverName, driverPhone, driverEmail, vehicleNumber } = req.body;

    if (!spaceId || !startTime || !endTime || !totalAmount || !driverName || !driverPhone || !driverEmail || !vehicleNumber) {
        res.status(400).json({ message: 'All booking fields (including driver details) are required' });
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
        status: 'CONFIRMED', // Auto-confirming for simplicity
    });

    const createdBooking = await booking.save();
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
    const ownerSpaces = await ParkingSpace.find({ ownerId: req.user._id }).select('_id');
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

    res.json({
        activeBookings: activeBookingsCount,
        totalRevenue: totalRevenue
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

export { createBooking, getBookingById, getDriverBookings, getSpaceBookings, getOwnerMetrics, getOwnerBookings };
