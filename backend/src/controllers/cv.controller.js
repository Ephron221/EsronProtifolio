const CV = require('../models/CV');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const https = require('https');
const http = require('http');

/**
 * Helper: Follow redirects and stream a remote URL to the Express response.
 * Cloudinary raw resources may redirect — this handles up to 5 hops.
 */
function streamRemoteFile(url, res, depth = 0) {
  if (depth > 5) {
    res.status(502).json({ message: 'Too many redirects when fetching CV.' });
    return;
  }

  const protocol = url.startsWith('https') ? https : http;
  protocol.get(url, (upstream) => {
    const { statusCode, headers } = upstream;

    // Follow redirects (301, 302, 307, 308)
    if ((statusCode === 301 || statusCode === 302 || statusCode === 307 || statusCode === 308) && headers.location) {
      upstream.resume(); // drain the response body so the socket can be reused
      return streamRemoteFile(headers.location, res, depth + 1);
    }

    if (statusCode !== 200) {
      res.status(statusCode || 502).json({ message: 'Failed to fetch CV from storage.' });
      return;
    }

    res.setHeader('Content-Type', headers['content-type'] || 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Curriculum_Vitae.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    if (headers['content-length']) {
      res.setHeader('Content-Length', headers['content-length']);
    }

    upstream.pipe(res);
  }).on('error', (err) => {
    console.error('CV proxy error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({ message: 'Failed to stream CV file.' });
    }
  });
}

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

// @desc    Proxy-stream the CV PDF from Cloudinary to avoid 401 direct-access errors
// @route   GET /api/cv/file
// @access  Public
const proxyCV = asyncHandler(async (req, res) => {
  const cv = await CV.findOne({});

  if (!cv || !cv.fileUrl) {
    res.status(404);
    throw new Error('No CV has been uploaded.');
  }

  streamRemoteFile(cv.fileUrl, res);
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
    resource_type: 'raw',
    type: 'upload',
    access_mode: 'public',
    public_id: `cv_${Date.now()}`,
  });

  let cv = await CV.findOne({});

  if (cv) {
    // Attempt to destroy old Cloudinary asset if publicId exists
    if (cv.publicId) {
      try {
        await cloudinary.uploader.destroy(cv.publicId, { resource_type: 'raw' });
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
        await cloudinary.uploader.destroy(cv.publicId, { resource_type: 'raw' });
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

module.exports = { getCV, proxyCV, uploadCV, deleteCV };
