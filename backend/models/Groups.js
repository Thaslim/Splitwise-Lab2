import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  createdBy: { type: String, required: true },
  groupPicture: { type: String },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default mongoose.model('Groups', GroupSchema);
