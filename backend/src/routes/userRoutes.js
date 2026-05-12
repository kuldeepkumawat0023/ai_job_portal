const express = require('express');
const { getProfile, updateProfile, deleteProfile, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadImage, uploadResume } = require('../middleware/upload');

const router = express.Router();

router.get('/all', getUsers);

// Both routes require the user to be logged in
router.use(protect);

router.get('/profile/:id', getProfile);
router.put('/profile/update/:id', uploadImage.single('profilePhoto'), updateProfile);
router.put('/profile/resume/:id', uploadResume.single('resume'), updateProfile);
router.delete('/profile/delete/:id', deleteProfile);

module.exports = router;
