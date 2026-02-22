import Booking from '../models/Booking.js';
import ParkingSpace from '../models/ParkingSpace.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { spaceId, startTime, endTime, totalAmount } = req.body;

    if (!spaceId || !startTime || !endTime || !totalAmount) {
        res.status(400).json({ message: 'All booking fields are required' });
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

export { createBooking, getBookingById, getDriverBookings, getSpaceBookings };
