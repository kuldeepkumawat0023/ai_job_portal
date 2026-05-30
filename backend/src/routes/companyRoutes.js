const express = require('express');
const { registerCompany, getCompanies, getCompanyById, updateCompany, switchCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.post('/register', authorize('recruiter', 'admin', 'super_admin'), registerCompany);
router.get('/all', getCompanies);
router.get('/:id', getCompanyById);
router.put('/update/:id', authorize('recruiter', 'admin', 'super_admin'), uploadImage.single('logo'), updateCompany);
router.put('/switch/:id', authorize('recruiter', 'admin', 'super_admin'), switchCompany);

module.exports = router;
