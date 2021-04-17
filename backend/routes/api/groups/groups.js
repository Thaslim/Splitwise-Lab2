import express from 'express';
import validator from 'express-validator';
import passport from 'passport';
import make_request from '../../../kafka/client.js';

const { check, validationResult } = validator;

const router = express.Router();
export default router;

// @route GET api/groups/:group_id
// @desc Get expense by group id
// @access Private
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const myData = { action: 'getExpenseList', groupID: req.params.id };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json({ groupExpense: results.message });
      }
    });
  }
);

// @route GET api/groups/:group_id
// @desc Get group balance
// @access Private
router.get(
  '/group-balance/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const myData = { action: 'getGroupBalance', groupID: req.params.id };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json({ members: results.message });
      }
    });
  }
);

// @route POST api/groups/
// @desc Add expense
// @access Private

router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    [
      check('description', "Description can't be blank").not().isEmpty(),
      check('amount', 'Enter a valid amount').isDecimal(),
    ],
  ],
  async (req, res) => {
    const { groupID, description, amount, date } = req.body;
    const paidByEmail = req.user.userEmail;
    const paidByName = req.user.userName;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const myData = {
      action: 'addExpense',
      groupID,
      description,
      amount,
      date,
      paidByEmail,
      paidByName,
      userID: req.user.id,
      userName: req.user.userName,
      userCurrenct: req.user.userCurrency,
    };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json(results.message);
      }
    });
  }
);
