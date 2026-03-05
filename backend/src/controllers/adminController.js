import User from '../models/User.js';
import ParkingSpace from '../models/ParkingSpace.js';

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
        const status = req.query.status || 'PENDING';
        // Populate owner data without exposing password/sensitive stuff
        const spaces = await ParkingSpace.find({ approvalStatus: status }).populate('ownerId', 'name email');
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
