import express from 'express';
import {
    createBooking,
    getBookingById,
    getDriverBookings,
    getSpaceBookings,
} from '../controllers/bookingController.js';
import { protect, owner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/my').get(protect, getDriverBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/space/:spaceId').get(protect, owner, getSpaceBookings);

export default router;
