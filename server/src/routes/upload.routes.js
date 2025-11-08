import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    // upload buffer to cloudinary via stream
    const streamUpload = (buffer) => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'avatars', resource_type: 'image' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      stream.end(buffer);
    });

    const result = await streamUpload(req.file.buffer);

    // update user
    const user = await User.findByIdAndUpdate(req.userId, { avatar: result.secure_url }, { new: true }).select('-password');
    res.json({ avatar: result.secure_url, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Upload failed' });
  }
});

export default router;
