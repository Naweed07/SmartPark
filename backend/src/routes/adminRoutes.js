import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    getAllUsers,
    updateUserStatus,
    getAdminSpaces,
    updateSpaceApproval,
    getAllBookings,
    getSpaceMessages,
    addSpaceMessage
} from '../controllers/adminController.js';

const router = express.Router();

// User management routes
router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id/status').put(protect, admin, updateUserStatus);

// Admin Space Routes
router.route('/spaces').get(protect, admin, getAdminSpaces);
router.route('/spaces/:id/approval').put(protect, admin, updateSpaceApproval);

// Admin / Owner Messaging Routes
router.route('/spaces/:id/messages')
    .get(protect, getSpaceMessages) // allow owner or admin
    .post(protect, addSpaceMessage); // allow owner or admin

// Admin Bookings
router.route('/bookings').get(protect, admin, getAllBookings);

export default router;
