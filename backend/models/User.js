import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userPicture: {
    type: String,
  },

  userPhone: {
    type: String,
  },
  userCurrency: {
    type: String,
    default: 'USD',
  },
  userTimezone: {
    type: String,
  },
  userLanguage: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Groups',
    },
  ],
});

export default mongoose.model('user', UserSchema);
