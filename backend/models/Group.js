import mongoose from 'mongoose';
import mongooseLogs from 'mongoose-activitylogs';

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  modifiedBy: {
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

  date: {
    type: Date,
    default: Date.now,
  },
});

GroupSchema.plugin(mongooseLogs, {
  schemaName: 'Group',
  createAction: 'created',
  updateAction: 'joined',
  deleteAction: 'left from',
});

export default mongoose.model('group', GroupSchema);
