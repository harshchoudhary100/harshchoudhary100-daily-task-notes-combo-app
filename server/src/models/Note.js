import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  color: { type: String, default: '#fffbe6' }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
