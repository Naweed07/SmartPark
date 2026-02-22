import mongoose from 'mongoose';

const parkingSpaceSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        address: { type: String, required: true },
        lat: { type: Number },
        lng: { type: Number },
    },
    capacity: {
        type: Number,
        required: true,
        default: 1,
    },
    rates: {
        hourly: { type: Number, required: true }, // Base rate for 1st hour
        customTiers: [{ // Dynamic pricing brackets for hours 2+
            minHours: { type: Number, required: true },
            maxHours: { type: Number, required: true },
            rate: { type: Number, required: true }
        }],
        daily: { type: Number, required: true },
    },
    rules: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const ParkingSpace = mongoose.model('ParkingSpace', parkingSpaceSchema);

export default ParkingSpace;
