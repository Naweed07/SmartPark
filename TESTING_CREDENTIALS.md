# SmartPark Testing Guide

This document contains credentials and instructions for testing the SmartPark application, specifically the payment and notification flows.

## 💳 PayPal Sandbox Testing

When making a booking as a Driver and selecting **Pay with PayPal**, you will be redirected to the PayPal Sandbox checkout. Use the following test credentials to simulate a successful payment without using real money.

**Buyer Account (Personal):**
- **Email:** `sb-mdjmm49777874@personal.example.com`
- **Password:** `sHqyS%l2`

*Note: Do not use your real PayPal account during development/testing.*

### Testing the Flow:
1. Log in as a Driver.
2. Search for a parking space and click **Book Now**.
3. Select **Pay with PayPal** as the payment method.
4. When the PayPal window opens, log in using the credentials above.
5. Confirm the payment. You will be redirected back to the SmartPark Dashboard.
6. Check your **My Bookings** tab to ensure the reservation is marked as `PAID`.
7. Check the simulated email receipt (Ethereal terminal output) and the Twilio WhatsApp notification.

## 📱 WhatsApp / SMS Notifications

The platform is configured to send booking confirmation receipts via Twilio.
By default, the sandbox environment is configured to send messages via WhatsApp.

- Ensure the Driver's phone number is registered with the Twilio Sandbox.
- Ensure the phone number includes the appropriate country code (e.g., `+94` for Sri Lanka) when registering or booking.
- If Twilio is not enabled in your `.env` file, this step will be safely skipped and the booking will still succeed.
