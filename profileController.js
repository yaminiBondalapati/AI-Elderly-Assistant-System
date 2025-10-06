// server/controllers/profileController.js
const User = require('../models/User');
const Profile = require('../models/Profile');

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const {
    fullName,
    age,
    gender,
    guardianName,
    guardianPhone,
    allergies,
    medicalHistory,
  } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user name if provided
    if (fullName) {
      user.name = fullName;
      await user.save();
    }

    // Find or create profile
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new Profile({ user: req.user.id });
    }

    // Update profile fields
    profile.age = age !== undefined ? age : profile.age;
    profile.gender = gender || profile.gender;
    profile.guardianName = guardianName || profile.guardianName;
    profile.guardianPhone = guardianPhone || profile.guardianPhone;
    profile.allergies = allergies ? (Array.isArray(allergies) ? allergies : allergies.split(',').map(a => a.trim())) : profile.allergies;
    profile.medicalHistory = medicalHistory || profile.medicalHistory;

    if (req.body.profilePicture) {
      profile.profilePicture = req.body.profilePicture; // base64 image
    }

    const updatedProfile = await profile.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: updatedProfile.profilePicture,
      age: updatedProfile.age,
      gender: updatedProfile.gender,
      guardianName: updatedProfile.guardianName,
      guardianPhone: updatedProfile.guardianPhone,
      allergies: updatedProfile.allergies,
      medicalHistory: updatedProfile.medicalHistory,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ user: req.user.id });

    const profileData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: profile ? profile.profilePicture : '',
      age: profile ? profile.age : null,
      gender: profile ? profile.gender : '',
      guardianName: profile ? profile.guardianName : '',
      guardianPhone: profile ? profile.guardianPhone : '',
      allergies: profile ? profile.allergies : [],
      medicalHistory: profile ? profile.medicalHistory : '',
    };

    res.json(profileData);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
