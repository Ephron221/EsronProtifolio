const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');
const cloudinary = require('../config/cloudinary');

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Determine resource_type:
    // PDFs MUST use 'raw' on Cloudinary — using 'auto' or 'image' saves them under /image/upload/
    // which then returns 401 when the backend proxy tries to stream them.
    const isPdf = req.file.mimetype === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'auto';

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'portfolio',
      resource_type: resourceType,
    });

    res.status(200).json({
      message: 'File uploaded successfully to Cloudinary',
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
