const Document = require('../models/Document');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

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
  createDocument,
  updateDocument,
  deleteDocument,
};
