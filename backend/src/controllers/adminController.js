import User from '../models/User.js';
import ParkingSpace from '../models/ParkingSpace.js';
import Booking from '../models/Booking.js';
import AdminReviewMessage from '../models/AdminReviewMessage.js';

// @desc    Get all users (Drivers, Owners, Admins)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching users' });
    }
};

// @desc    Update user status (e.g. suspend/activate)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
    try {
        // Pending specific fields for "isSuspended" in User schema if requested,
        // for now just returns the user object as an example toggler
        const user = await User.findById(req.params.id);

        if (user) {
            // Assume we add 'isActive' to user later if needed
            // user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating user status' });
    }
};

// @desc    Get all parking spaces based on approval status (default PENDING)
// @route   GET /api/admin/spaces
// @access  Private/Admin
export const getAdminSpaces = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status && req.query.status !== 'ALL') {
            filter.approvalStatus = req.query.status;
        } else if (!req.query.status) {
            filter.approvalStatus = 'PENDING';
        }

        // Populate owner data without exposing password/sensitive stuff
        const spaces = await ParkingSpace.find(filter).populate('ownerId', 'name email').lean();

        // Add unread message count for Admin
        for (let space of spaces) {
            const hasUnread = await AdminReviewMessage.exists({ spaceId: space._id, senderRole: 'OWNER', isRead: false });
            space.hasUnreadMessages = !!hasUnread;
        }

        res.json(spaces);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching spaces' });
    }
};

// @desc    Approve or Reject a parking space
// @route   PUT /api/admin/spaces/:id/approval
// @access  Private/Admin
export const updateSpaceApproval = async (req, res) => {
    try {
        const { approvalStatus } = req.body;

        if (!['PENDING', 'APPROVED', 'REJECTED'].includes(approvalStatus)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const space = await ParkingSpace.findById(req.params.id);

        if (space) {
            space.approvalStatus = approvalStatus;

            // If rejected, usually you might want to also set isActive to false to be safe
            if (approvalStatus === 'REJECTED') {
                space.isActive = false;
            } else if (approvalStatus === 'APPROVED') {
                space.isActive = true;
            }

            const updatedSpace = await space.save();
            res.json(updatedSpace);
        } else {
            res.status(404).json({ message: 'Parking space not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating space approval' });
    }
};

// @desc    Get all bookings across the platform
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('driverId', 'name email')
            .populate('spaceId', 'location rates capacity')
            .sort({ createdAt: -1 }); // Newest first
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching platform bookings' });
    }
};

// @desc    Get all messages for a specific parking space
// @route   GET /api/admin/spaces/:id/messages
// @access  Private (Admin or Owner)
export const getSpaceMessages = async (req, res) => {
    try {
        const messages = await AdminReviewMessage.find({ spaceId: req.params.id })
            .populate('senderId', 'name role')
            .sort({ createdAt: 1 }); // Oldest first for chronological chat

        // Mark messages as read depending on the user's role
        if (req.user.role === 'ADMIN') {
            await AdminReviewMessage.updateMany(
                { spaceId: req.params.id, senderRole: 'OWNER', isRead: false },
                { $set: { isRead: true } }
            );
        } else if (req.user.role === 'OWNER') {
            await AdminReviewMessage.updateMany(
                { spaceId: req.params.id, senderRole: 'ADMIN', isRead: false },
                { $set: { isRead: true } }
            );
        }

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching messages' });
    }
};

// @desc    Add a message to a parking space discussion
// @route   POST /api/admin/spaces/:id/messages
// @access  Private (Admin or Owner)
export const addSpaceMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        const space = await ParkingSpace.findById(req.params.id);
        if (!space) {
            return res.status(404).json({ message: 'Parking space not found' });
        }

        const newMessage = new AdminReviewMessage({
            spaceId: req.params.id,
            senderId: req.user._id,
            senderRole: req.user.role,
            message: message
        });

        const savedMessage = await newMessage.save();

        // Populate sender info before returning
        await savedMessage.populate('senderId', 'name role');

        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server Error adding message' });
    }
};
