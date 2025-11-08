import { Router } from 'express';
import Note from '../models/Note.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

// Create
router.post('/', async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, user: req.userId });
    res.status(201).json(note);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Read (list + optional search)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const filter = { user: req.userId };
    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { content: new RegExp(q, 'i') }
      ];
    }
    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
