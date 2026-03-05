import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Booking from '../models/Booking.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

router.post('/process', protect, (req, res) => {
    const { amount, bookingId } = req.body;

    // Simulate processing time
    setTimeout(async () => {
        // 90% success rate for mock
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            try {
                // Find booking to get details for the receipt
                const booking = await Booking.findById(bookingId).populate('spaceId', 'name location');

                if (booking) {
                    // Update payment status to paid
                    booking.paymentStatus = 'PAID';
                    booking.transactionId = `txn_${Date.now()}`;
                    await booking.save();

                    return res.json({ success: true, transactionId: booking.transactionId });

                }
            } catch (error) {
                console.error("Error updating booking payment status:", error);
            }

            res.json({ success: true, transactionId: `txn_${Date.now()}` });
        } else {
            res.status(400).json({ success: false, message: 'Payment declined by bank' });
        }
    }, 1000);
});

export default router;
