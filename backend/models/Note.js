import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Untitled Note'
    },
    content: {
      type: String,
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema);