const CV = require('../models/CV');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

// @desc    Get the single CV
// @route   GET /api/cv
// @access  Public
const getCV = asyncHandler(async (req, res) => {
  const cv = await CV.findOne({}); 
  
  if (cv) {
    res.json(cv);
  } else {
    res.status(404).json({ message: 'No CV has been uploaded.' });
  }
});

// @desc    Upload or replace the CV
// @route   POST /api/cv/upload
// @access  Private
const uploadCV = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded.');
  }

  // Upload buffer to Cloudinary
  const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const uploadResult = await cloudinary.uploader.upload(fileBase64, {
    folder: 'portfolio/cv',
    resource_type: 'auto',
    public_id: `cv_${Date.now()}`,
  });

  let cv = await CV.findOne({});

  if (cv) {
    // Attempt to destroy old Cloudinary asset if publicId exists
    if (cv.publicId) {
      try {
        await cloudinary.uploader.destroy(cv.publicId, { resource_type: 'auto' });
      } catch (cloudErr) {
        console.warn('Failed to delete old CV from Cloudinary:', cloudErr.message);
      }
    }

    cv.fileUrl = uploadResult.secure_url;
    cv.publicId = uploadResult.public_id;
    cv.lastUpdated = Date.now();
  } else {
    cv = new CV({
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      lastUpdated: Date.now()
    });
  }

  const updatedCV = await cv.save();
  res.status(201).json(updatedCV);
});

// @desc    Delete the CV
// @route   DELETE /api/cv
// @access  Private
const deleteCV = asyncHandler(async (req, res) => {
  const cv = await CV.findOne({});

  if (cv) {
    if (cv.publicId) {
      try {
        await cloudinary.uploader.destroy(cv.publicId, { resource_type: 'auto' });
      } catch (cloudErr) {
        console.warn('Failed to delete CV from Cloudinary:', cloudErr.message);
      }
    }

    await cv.deleteOne();
    res.json({ message: 'CV removed successfully' });
  } else {
    res.status(404);
    throw new Error('CV not found');
  }
});

module.exports = { getCV, uploadCV, deleteCV };
