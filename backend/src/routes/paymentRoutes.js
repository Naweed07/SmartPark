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
                    await booking.save();

                    if (booking.driverEmail) {
                        const emailHtml = `
                        <div style="font-family: Arial, sans-serif; max-w-lg mx-auto p-4 bg-gray-50 border rounded-lg">
                            <h2 style="color: #14b8a6;">Booking Receipt Confirmed!</h2>
                            <p>Hi <b>${booking.driverName}</b>,</p>
                            <p>Your mock payment of <b>$${booking.totalAmount}</b> was successful. Here is your parking receipt:</p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Parking Space:</b></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.spaceId.name}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Location:</b></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.spaceId.location.address}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Vehicle Number:</b></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.vehicleNumber}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Duration:</b></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.bookedHours} Hour(s)</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Applied Rate:</b></td><td style="padding: 8px; border-bottom: 1px solid #ddd;"><i>${booking.appliedRateDescription}</i></td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Total Amount:</b></td><td style="padding: 8px; border-bottom: 1px solid #ddd;"><b style="color: #14b8a6;">$${booking.totalAmount}</b></td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Start:</b></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(booking.startTime).toLocaleString()}</td></tr>
                                <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>End:</b></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(booking.endTime).toLocaleString()}</td></tr>
                            </table>
                            
                            <div style="text-align: center; margin-top: 20px;">
                                <p style="font-size: 14px; font-weight: bold; color: #333;">Scan this QR code with the space owner upon arrival:</p>
                                ${booking.qrCodeUrl ? `<img src="${booking.qrCodeUrl}" alt="Booking QR Code" style="width: 200px; height: 200px; margin: 10px auto;" />` : ''}
                            </div>
                            
                            <p style="margin-top: 20px; font-size: 12px; color: #888;">Thank you for using SmartPark!</p>
                        </div>
                    `;

                        await sendEmail({
                            to: booking.driverEmail,
                            subject: `💳 SmartPark Receipt for ${booking.spaceId.name}`,
                            html: emailHtml
                        });
                    }
                }
            } catch (error) {
                console.error("Error generating receipt email:", error);
            }

            res.json({ success: true, transactionId: `txn_${Date.now()}` });
        } else {
            res.status(400).json({ success: false, message: 'Payment declined by bank' });
        }
    }, 1000);
});

export default router;
