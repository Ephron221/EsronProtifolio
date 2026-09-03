const express = require('express');
const router = express.Router();
const { getCV, proxyCV, uploadCV, deleteCV } = require('../controllers/cv.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.route('/').get(getCV).delete(protect, deleteCV);
router.route('/file').get(proxyCV);
router.route('/upload').post(protect, upload.single('cv'), uploadCV);

module.exports = router;
