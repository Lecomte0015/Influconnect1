const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { authenticateToken } = require('../middlewares/authMiddleware');
const invoiceController = require('../controllers/invoiceController');

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/invoices'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });


router.get('/', authenticateToken, invoiceController.getUserInvoices);


router.post('/', authenticateToken, upload.single('file'), invoiceController.uploadInvoice);

module.exports = router;
