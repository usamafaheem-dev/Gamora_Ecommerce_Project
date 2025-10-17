const User = require('../models/user');
const { validationResult } = require('express-validator');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(req.user._id).select(
            'firstName lastName mobileNumber email address profileImage'
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            profile: user,
        });
    } catch (error) {
        console.error('GetProfile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        // Validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, mobileNumber, address } = req.body;
        const profileImage = req.file ? req.file.path : undefined;

        // Check auth
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch existing user
        const existingUser = await User.findById(req.user._id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Require image if none exists
        if (!profileImage && !existingUser.profileImage) {
            return res.status(400).json({ message: 'Profile image is required' });
        }

        // Prepare update
        const updateData = {
            firstName,
            lastName,
            mobileNumber,
            address,
            ...(profileImage && { profileImage }),
        };

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('firstName lastName mobileNumber email address profileImage');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profile: updatedUser,
        });
    } catch (error) {
        console.error('UpdateProfile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user profile fields
exports.deleteProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const deletedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    firstName: '',
                    lastName: '',
                    mobileNumber: '',
                    address: '',
                    profileImage: '',
                },
            },
            { new: true }
        );

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile deleted successfully',
        });
    } catch (error) {
        console.error('DeleteProfile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
