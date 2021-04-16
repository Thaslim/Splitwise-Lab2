import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  groupPicture: { type: String },
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'expense',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('group', GroupSchema);
