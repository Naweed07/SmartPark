import express from 'express';
import {
    createBooking,
    getBookingById,
    getDriverBookings,
    getSpaceBookings,
    getOwnerMetrics,
    getOwnerBookings,
    checkInBooking,
} from '../controllers/bookingController.js';
import { protect, owner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/check-in').post(protect, owner, checkInBooking);
router.route('/owner').get(protect, owner, getOwnerBookings);
router.route('/metrics/owner').get(protect, owner, getOwnerMetrics);
router.route('/my').get(protect, getDriverBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/space/:spaceId').get(protect, owner, getSpaceBookings);

export default router;
