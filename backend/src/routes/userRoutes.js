const express = require('express');
const { getProfile, updateProfile, deleteProfile, getUsers, getTeamMembers, inviteTeamMember, removeTeamMember, getBillingUsage } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

const router = express.Router();

router.get('/all', getUsers);

// Both routes require the user to be logged in
router.use(protect);

router.get('/profile/:id', getProfile);
router.put('/profile/update/:id', uploadImage.single('profilePhoto'), updateProfile);
router.put('/profile/resume/:id', updateProfile);     // Now accepts JSON { resumeUrl } instead of multipart file
router.delete('/profile/delete/:id', deleteProfile);

router.get('/team/all', getTeamMembers);
router.post('/team/invite', inviteTeamMember);
router.delete('/team/remove/:id', removeTeamMember);
router.get('/billing/usage', getBillingUsage);

module.exports = router;
