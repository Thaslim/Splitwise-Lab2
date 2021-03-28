import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  action: { type: String, required: true },
});
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
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'expense',
    },
  ],
  activity: [ActivitySchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('group', GroupSchema);
