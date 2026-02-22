import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/process', protect, (req, res) => {
    const { amount, bookingId } = req.body;

    // Simulate processing time
    setTimeout(() => {
        // 90% success rate for mock
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            res.json({ success: true, transactionId: `txn_${Date.now()}` });
        } else {
            res.status(400).json({ success: false, message: 'Payment declined by bank' });
        }
    }, 1000);
});

export default router;
