const Document = require('../models/Document');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const https = require('https');
const http = require('http');

/**
 * Helper: Follow redirects and stream a remote URL to the Express response.
 * Handles 301/302 redirects from Cloudinary raw assets.
 */
function streamRemoteFile(url, res, depth = 0) {
  if (depth > 5) {
    res.status(502).json({ message: 'Too many redirects when fetching document.' });
    return;
  }

  const protocol = url.startsWith('https') ? https : http;
  protocol.get(url, (upstream) => {
    const { statusCode, headers } = upstream;

    // Follow redirects
    if ((statusCode === 301 || statusCode === 302 || statusCode === 307 || statusCode === 308) && headers.location) {
      upstream.resume(); // drain the response
      return streamRemoteFile(headers.location, res, depth + 1);
    }

    if (statusCode !== 200) {
      res.status(statusCode || 502).json({ message: 'Failed to fetch document from storage.' });
      return;
    }

    res.setHeader('Content-Type', headers['content-type'] || 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    if (headers['content-length']) {
      res.setHeader('Content-Length', headers['content-length']);
    }

    upstream.pipe(res);
  }).on('error', (err) => {
    console.error('Document proxy error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({ message: 'Failed to stream document file.' });
    }
  });
}

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({}).sort({ createdAt: -1 });
  res.json(documents);
});

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Public
const getDocumentById = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (document) {
    res.json(document);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

// @desc    Proxy-stream a document PDF from Cloudinary to avoid 401 direct-access errors
// @route   GET /api/documents/:id/file
// @access  Public
const proxyDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document || !document.fileUrl) {
    res.status(404);
    throw new Error('Document not found or has no file.');
  }

  let fileUrl = document.fileUrl;

  // Guard 1: Reject legacy local file paths (e.g., /uploads/...) that don't exist on Vercel
  if (fileUrl.startsWith('/uploads/') || !fileUrl.startsWith('http')) {
    res.status(404).json({
      message: 'This document was uploaded to the old local server and is no longer available. Please re-upload the PDF file.'
    });
    return;
  }

  // Guard 2: Cloudinary PDFs must be accessed via /raw/upload/, not /image/upload/.
  // When resource_type: 'auto' is used and the file is a PDF, Cloudinary may store it under
  // /image/upload/ but then returns 401 when you try to stream it. Force the correct path.
  if (fileUrl.includes('cloudinary.com') && fileUrl.includes('/image/upload/')) {
    fileUrl = fileUrl.replace('/image/upload/', '/raw/upload/');
    console.log(`[document proxy] Normalized Cloudinary URL to raw type: ${fileUrl}`);
  }

  streamRemoteFile(fileUrl, res);
});

// @desc    Create a document
// @route   POST /api/documents
// @access  Private
const createDocument = asyncHandler(async (req, res) => {
  const { title, type, description, fileUrl, publicId } = req.body;

  const document = new Document({
    title,
    type,
    description,
    fileUrl,
    publicId,
  });

  const createdDocument = await document.save();
  res.status(201).json(createdDocument);
});

// @desc    Update a document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = asyncHandler(async (req, res) => {
  const { title, type, description, fileUrl, publicId } = req.body;

  const document = await Document.findById(req.params.id);

  if (document) {
    document.title = title || document.title;
    document.type = type || document.type;
    document.description = description !== undefined ? description : document.description;
    document.fileUrl = fileUrl || document.fileUrl;
    if (publicId) document.publicId = publicId;

    const updatedDocument = await document.save();
    res.json(updatedDocument);
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (document) {
    if (document.publicId) {
      try {
        await cloudinary.uploader.destroy(document.publicId, { resource_type: 'auto' });
      } catch (cloudErr) {
        console.warn('Failed to delete document from Cloudinary:', cloudErr.message);
      }
    }

    await document.deleteOne();
    res.json({ message: 'Document removed successfully' });
  } else {
    res.status(404);
    throw new Error('Document not found');
  }
});

module.exports = {
  getDocuments,
  getDocumentById,
  proxyDocument,
  createDocument,
  updateDocument,
  deleteDocument,
};

