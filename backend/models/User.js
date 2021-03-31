import mongoose from 'mongoose';

const MemberBalanceSchema = new mongoose.Schema({
  memberID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  amount: { type: Number, default: 0.0 },
  groupID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group',
  },
});

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
      ref: 'group',
    },
  ],
  invites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'group',
    },
  ],
  iOwe: [MemberBalanceSchema],
  owedToMe: [MemberBalanceSchema],
});

export default mongoose.model('user', UserSchema);
