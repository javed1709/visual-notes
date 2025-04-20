import express from 'express';
import { upload, parseFile } from '../controllers/fileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for file parsing
router.post('/parse', protect, upload.single('file'), parseFile);

export default router;