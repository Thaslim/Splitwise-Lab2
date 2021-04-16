import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  action: { type: String, required: true },
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'group',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('activity', ActivitySchema);
