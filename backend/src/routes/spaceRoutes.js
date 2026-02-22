import express from 'express';
import {
    getSpaces,
    getSpaceById,
    createSpace,
    updateSpace,
    deleteSpace,
    getOwnerSpaces,
} from '../controllers/spaceController.js';
import { protect, owner } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSpaces).post(protect, owner, createSpace);
router.route('/my').get(protect, owner, getOwnerSpaces);
router.route('/:id').get(getSpaceById).put(protect, owner, updateSpace).delete(protect, owner, deleteSpace);

export default router;
