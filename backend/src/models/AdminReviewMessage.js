import mongoose from 'mongoose';

const adminReviewMessageSchema = mongoose.Schema({
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ParkingSpace',
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    senderRole: {
        type: String,
        enum: ['ADMIN', 'OWNER'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const AdminReviewMessage = mongoose.model('AdminReviewMessage', adminReviewMessageSchema);

export default AdminReviewMessage;
