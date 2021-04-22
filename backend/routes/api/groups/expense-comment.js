import express from 'express';
import passport from 'passport';
import make_request from '../../../kafka/client.js';

const router = express.Router();
export default router;

// @route GET api/expense/
// @desc Get comment
// @access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const myData = { action: 'getComments', expenseID: req.params.id };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json({ comments: results.message });
      }
    });
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
    const myData = {
      action: 'postComments',
      expenseID,
      fromName: req.user.userName,
      comment: message,
      userID: req.user.id,
    };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json({ comments: results.message });
      }
    });
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
    const myData = { action: 'deleteComments', expenseID, commentID };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json({ comments: results.message });
      }
    });
  }
);
