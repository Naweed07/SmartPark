import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
    getAllUsers,
    updateUserStatus,
    getAdminSpaces,
    updateSpaceApproval
} from '../controllers/adminController.js';

const router = express.Router();

// User management routes
router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id/status').put(protect, admin, updateUserStatus);

// Parking space management routes
router.route('/spaces').get(protect, admin, getAdminSpaces);
router.route('/spaces/:id/approval').put(protect, admin, updateSpaceApproval);

export default router;
