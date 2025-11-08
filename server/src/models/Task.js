import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  dueDate: { type: Date, default: null },
  priority: { type: String, enum: ['low','medium','high'], default: 'low' },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
