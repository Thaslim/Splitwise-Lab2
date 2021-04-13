import express from 'express';
import validator from 'express-validator';
import passport from 'passport';
import Expense from '../../../models/Expense.js';

const router = express.Router();
export default router;

// @route GET api/expense/
// @desc Get comment
// @access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const getComments = await Expense.findById(req.params.id, {
        messages: 1,
      });

      res.json({
        comments: getComments.messages,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route POST api/expense/
// @desc Post Comment
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { expenseID, message } = req.body;
    try {
      const getComments = await Expense.findByIdAndUpdate(
        expenseID,
        { $push: { messages: { from: req.user.userName, message } } },
        { select: ['messages'], new: true }
      );

      res.json({
        comments: getComments.messages,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route POST api/expense/
// @desc delete comment
// @access Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { expenseID, commentID } = req.body;
    try {
      const getComments = await Expense.findByIdAndUpdate(
        expenseID,
        { $pull: { messages: { _id: commentID } } },
        { select: ['messages'], new: true }
      );

      res.json({
        comments: getComments.messages,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);
