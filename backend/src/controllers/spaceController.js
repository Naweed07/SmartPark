import ParkingSpace from '../models/ParkingSpace.js';

// @desc    Get all active parking spaces
// @route   GET /api/spaces
// @access  Public
const getSpaces = async (req, res) => {
    // Only return active spaces that have been explicitly APPROVED by an Admin
    const spaces = await ParkingSpace.find({ isActive: true, approvalStatus: 'APPROVED' }).populate('ownerId', 'name email');
    res.json(spaces);
};

// @desc    Get single parking space
// @route   GET /api/spaces/:id
// @access  Public
const getSpaceById = async (req, res) => {
    const space = await ParkingSpace.findById(req.params.id).populate('ownerId', 'name email');

    if (space) {
        res.json(space);
    } else {
        res.status(404).json({ message: 'Parking space not found' });
    }
};

// @desc    Create a parking space
// @route   POST /api/spaces
// @access  Private/Owner
const createSpace = async (req, res) => {
    const { name, location, capacity, rates, rules, dynamicPricing } = req.body;

    const space = new ParkingSpace({
        ownerId: req.user._id,
        name,
        location,
        capacity,
        rates,
        dynamicPricing,
        rules,
    });

    const createdSpace = await space.save();
    res.status(201).json(createdSpace);
};

// @desc    Update a parking space
// @route   PUT /api/spaces/:id
// @access  Private/Owner
const updateSpace = async (req, res) => {
    const { name, location, capacity, rates, rules, isActive, dynamicPricing } = req.body;

    const space = await ParkingSpace.findById(req.params.id);

    if (space) {
        if (space.ownerId.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized to update this space' });
            return;
        }

        space.name = name || space.name;
        space.location = location || space.location;
        space.capacity = capacity || space.capacity;
        space.rates = rates || space.rates;
        if (dynamicPricing !== undefined) space.dynamicPricing = dynamicPricing;
        space.rules = rules || space.rules;
        if (isActive !== undefined) space.isActive = isActive;

        const updatedSpace = await space.save();
        res.json(updatedSpace);
    } else {
        res.status(404).json({ message: 'Parking space not found' });
    }
};

// @desc    Delete a parking space
// @route   DELETE /api/spaces/:id
// @access  Private/Owner
const deleteSpace = async (req, res) => {
    const space = await ParkingSpace.findById(req.params.id);

    if (space) {
        if (space.ownerId.toString() !== req.user._id.toString()) {
            res.status(401).json({ message: 'Not authorized to delete this space' });
            return;
        }

        await ParkingSpace.deleteOne({ _id: space._id });
        res.json({ message: 'Parking space removed' });
    } else {
        res.status(404).json({ message: 'Parking space not found' });
    }
};

// @desc    Get owner's spaces
// @route   GET /api/spaces/my
// @access  Private/Owner
const getOwnerSpaces = async (req, res) => {
    const spaces = await ParkingSpace.find({ ownerId: req.user._id });
    res.json(spaces);
};

export { getSpaces, getSpaceById, createSpace, updateSpace, deleteSpace, getOwnerSpaces };
