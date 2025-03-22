const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
const {uploadImageController, fetchImageController, deleteImageController} = require('../controllers/img-controllers');
const router = express.Router();

router.post('/upload',authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImageController);
router.get('/fetch', authMiddleware,fetchImageController);
router.delete('/delete/:id', authMiddleware, deleteImageController);
module.exports = router;