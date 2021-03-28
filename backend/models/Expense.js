import mongoose from 'mongoose';

const SplitSchema = new mongoose.Schema({
  memberID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  balance: { type: Number },
  isSettled: { type: Boolean },
});

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidByEmail: { type: String, required: true },
  date: { type: Date, required: true },
  updatedDate: { type: Date, default: Date.now },
  ExpenseSplit: [SplitSchema],
});

export default mongoose.model('expense', ExpenseSchema);
