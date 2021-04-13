import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidByName: { type: String, required: true },
  paidByEmail: { type: String, required: true },
  date: { type: Date, required: true },
  updatedDate: { type: Date, default: Date.now },
  messages: [
    {
      from: { type: String },
      message: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model('expense', ExpenseSchema);
