/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */
/* eslint-disable object-curly-newline */
import express from 'express';
import validator from 'express-validator';
import passport from 'passport';
import multer from 'multer';
import Group from '../../../models/Group.js';
import Expense from '../../../models/Expense.js';

const { check, validationResult } = validator;

const router = express.Router();
export default router;

// @route GET api/groups/:group_id
// @desc Get expense by group id
// @access Private
// router.get(
//   '/:id',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       const groupExpense = await splitwisedb.getGroupExpense(
//         req.params.id,
//         req.user.key
//       );
//       const memCount = await splitwisedb.getGroupMemberIDs(req.params.id);
//       const groupMemberBalance = await splitwisedb.getGroupBalances(
//         req.params.id
//       );
//       res.json({
//         groups: groupExpense,
//         memCount: memCount.length,
//         groupMemberBalance: groupMemberBalance,
//       });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

// @route POST api/groups/:group_id
// @desc Add expense
// @access Private

const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const expense = new Expense({ description, amount, paidByEmail, date });
      const groupInfo = await Group.findById(groupID, {
        members: 1,
        groupName: 1,
        _id: 0,
      });
      groupInfo.members.map((mem) => {
        let bal;

        if (String(mem) === String(req.user.id)) {
          bal = roundToTwo(amount / groupInfo.members.length - amount);
        } else {
          bal = roundToTwo(amount / groupInfo.members.length);
        }

        expense.ExpenseSplit.push({
          memberID: mem,
          balance: bal,
          isSettled: 0,
        });
      });
      expense.save();
      await Group.findByIdAndUpdate(groupID, {
        $push: {
          expenses: expense._id,
          activity: {
            actionBy: req.user.id,
            action: `added ${amount} to ${groupInfo.groupName} group`,
          },
        },
      });
      res.send('Expense Added');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
