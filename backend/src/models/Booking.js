import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ParkingSpace',
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        default: 'CONFIRMED',
    },
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
