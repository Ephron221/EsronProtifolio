const express = require('express');
const router = express.Router();
const {
  getDocuments,
  getDocumentById,
  proxyDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} = require('../controllers/document.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/').get(getDocuments).post(protect, createDocument);

// Proxy endpoint to stream PDFs server-side (avoids Cloudinary 401 in browser)
router.route('/:id/file').get(proxyDocument);

router
  .route('/:id')
  .get(getDocumentById)
  .put(protect, updateDocument)
  .delete(protect, deleteDocument);

module.exports = router;

