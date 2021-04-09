import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group',
  },
  memberID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  getBack: { type: Number, default: 0.0 },
  give: { type: Number, default: 0.0 },
});

export default mongoose.model('groupMembers', MemberSchema);
