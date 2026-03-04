import twilio from 'twilio';
import https from 'https';

/**
 * Send a booking confirmation via WhatsApp (fallback to SMS if disabled)
 * @param {string} toPhone - The driver's phone number
 * @param {Object} booking - The booking document containing space and time info
 */
export const sendBookingConfirmation = async (toPhone, booking) => {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        console.warn("Twilio is not configured. Skipping SMS/WhatsApp notification.");
        return { success: false, error: 'Twilio not configured' };
    }

    let client = null;
    try {
        // Create an HTTPS agent that ignores SSL certificate errors for local development
        const agent = new https.Agent({ rejectUnauthorized: false });
        // Use Twilio's default RequestClient but override the HTTP agent
        const RequestClient = twilio.RequestClient;
        const httpClient = new RequestClient({ httpAgent: agent });

        client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, {
            httpClient: httpClient
        });
    } catch (error) {
        console.error("Twilio Initialization Error:", error.message);
        return { success: false, error: 'Twilio Init Failed' };
    }

    try {
        // Format the destination number to standard E.164 (super basic logic for example purpose)
        // Note: Twilio requires exact standard formatting (+1234567890)
        let formattedPhone = toPhone.trim();
        if (!formattedPhone.startsWith('+')) {
            // Assuming default local code if not provided (e.g. +94 for Sri Lanka mostly intended here since user mentioned SL names previously)
            // Just prepending + if it doesn't have it, but usually the user inputs it. We will leave it raw for the sandbox.
            if (formattedPhone.length === 10 && formattedPhone.startsWith('0')) {
                formattedPhone = '+94' + formattedPhone.substring(1);
            }
        }

        const startDateStr = new Date(booking.startTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
        const endDateStr = new Date(booking.endTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

        const messageBody = `🚗 *SmartPark Booking Confirmed!*\n\n*Booking ID:* ${booking._id}\n*Start:* ${startDateStr}\n*End:* ${endDateStr}\n*Vehicle:* ${booking.vehicleNumber}\n*Total:* $${booking.totalAmount}\n\nThank you for using SmartPark! Have a safe trip.`;

        // By default Twilio Sandbox uses whatsapp:+14155238886 format for WA, standard for SMS
        // For this implementation, we will send standard SMS by default. To do true WA, we'd prefix with "whatsapp:"
        const useWhatsApp = process.env.TWILIO_USE_WHATSAPP === 'true';

        const payload = {
            body: messageBody,
            from: useWhatsApp ? `whatsapp:${process.env.TWILIO_PHONE_NUMBER}` : process.env.TWILIO_PHONE_NUMBER,
            to: useWhatsApp ? `whatsapp:${formattedPhone}` : formattedPhone
        };

        const result = await client.messages.create(payload);
        console.log(`[Twilio] Notification sent successfully to ${toPhone}. SID: ${result.sid}`);
        return { success: true, sid: result.sid };
    } catch (error) {
        console.error("[Twilio] Failed to send notification:", error.message);
        return { success: false, error: error.message };
    }
};
