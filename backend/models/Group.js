import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  memberID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  getBack: { type: Number, default: 0.0 },
  give: { type: Number, default: 0.0 },
});

const ActivitySchema = new mongoose.Schema({
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  action: { type: String, required: true },
  userSpecific: { type: Boolean, required: true },
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
  members: [MemberSchema],
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
