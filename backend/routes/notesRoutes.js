import express from 'express';
import { 
  generateAnswers, 
  shareNote,
  getUserNotes,
  getSharedNote,
  saveManualNote, 
  getNoteById,
  updateNote
} from '../controllers/notesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require authentication for note generation and sharing
router.post('/generate', protect, generateAnswers);
router.post('/manual-save', protect, saveManualNote);
router.put('/:id/share', protect, shareNote);
router.put('/:id', protect, updateNote);
router.get('/', protect, getUserNotes);
router.get('/shared/:id', getSharedNote);
router.get('/:id', protect, getNoteById);

export default router;