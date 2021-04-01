import express from 'express';
import validator from 'express-validator';
import passport from 'passport';
import multer from 'multer';
import getSymbolFromCurrency from 'currency-symbol-map';
import Group from '../../../models/Group.js';
import Expense from '../../../models/Expense.js';
import User from '../../../models/User.js';

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
    try {
      const groupExpense = await Group.findById(req.params.id, {
        expenses: 1,
      }).populate({
        path: 'expenses',
        select: ['paidByName', 'paidByEmail', 'description', 'amount', 'date'],
      });

      res.json({
        groupExpense,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route POST api/groups/:group_id
// @desc Add expense
// @access Private

export const roundToTwo = (num) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

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

    try {
      const expense = new Expense({
        description,
        amount,
        paidByEmail,
        paidByName,
        date,
      });
      expense.save();
      const groupInfo = await Group.findById(groupID, {
        members: 1,
        groupName: 1,
        _id: 0,
      });
      groupInfo.members.map(async (mem) => {
        let bal;
        const prevGet = mem.getBack;
        const prevGive = mem.give;

        if (String(mem.memberID) === String(req.user.id)) {
          bal = roundToTwo(
            amount - roundToTwo(amount / groupInfo.members.length)
          );

          await Group.findOneAndUpdate(
            {
              _id: groupID,
              members: { $elemMatch: { memberID: mem.memberID } },
            },
            { $set: { 'members.$.getBack': roundToTwo(prevGet + bal) } }
          );
        } else {
          bal = roundToTwo(amount / groupInfo.members.length);

          await Group.findOneAndUpdate(
            {
              _id: groupID,
              members: { $elemMatch: { memberID: mem.memberID } },
            },
            { $set: { 'members.$.give': roundToTwo(prevGive + bal) } }
          );
        }
      });

      const membersExceptMe = groupInfo.members.filter(
        (mem) => String(mem.memberID) !== String(req.user.id)
      );

      const membersExceptMeIds = membersExceptMe.map((mem) => mem.memberID);
      membersExceptMe.map(async (mem) => {
        await User.findByIdAndUpdate(req.user.id, {
          $addToSet: {
            owedToMe: {
              memberID: mem.memberID,
              amount: roundToTwo(amount / groupInfo.members.length),
              groupID,
            },
          },
        });
      });
      await User.updateMany(
        { _id: { $in: membersExceptMeIds } },
        {
          $addToSet: {
            iOwe: {
              memberID: req.user.id,
              amount: roundToTwo(amount / groupInfo.members.length),
              groupID,
            },
          },
        }
      );

      await Group.findByIdAndUpdate(groupID, {
        $push: {
          expenses: expense._id,
          activity: {
            actionBy: req.user.id,
            action: `added ${getSymbolFromCurrency(
              req.user.userCurrency
            )}${amount} to ${groupInfo.groupName} group`,
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
