import dotenv from 'dotenv';
import { sendBookingConfirmation } from './src/utils/twilioService.js';

dotenv.config();

const testTwilio = async () => {
    console.log("Testing Twilio with SID:", process.env.TWILIO_ACCOUNT_SID);
    const mockBooking = {
        _id: "test_123",
        startTime: new Date(),
        endTime: new Date(),
        vehicleNumber: "TEST-1234",
        totalAmount: 10
    };

    // Replace with a dummy number
    const result = await sendBookingConfirmation("+94770000000", mockBooking);
    console.log("Result:", result);
};

testTwilio();
