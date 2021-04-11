import express from 'express';
import validator from 'express-validator';
import passport from 'passport';
import getSymbolFromCurrency from 'currency-symbol-map';
import Group from '../../../models/Group.js';
import Expense from '../../../models/Expense.js';
import User from '../../../models/User.js';
import Activity from '../../../models/Activity.js';
import GroupMembers from '../../../models/GroupMembers.js';

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

// @route GET api/groups/:group_id
// @desc Get group balance
// @access Private
router.get(
  '/group-balance/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const members = await GroupMembers.find(
        { groupID: req.params.id },
        { _id: 0 }
      ).populate({
        path: 'memberID',
        select: ['userName', 'userEmail', 'userPicture'],
      });

      res.json({
        members,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route POST api/groups/
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

      const getGroupMembers = await GroupMembers.find({ groupID });

      const membersExceptMe = getGroupMembers.filter(
        (mem) => String(mem.memberID) !== String(req.user.id)
      );

      const mybal = roundToTwo(
        amount - roundToTwo(amount / getGroupMembers.length)
      );
      const othersBal = roundToTwo(amount / getGroupMembers.length);

      const groupMemberIdsExceptMe = membersExceptMe.map((mem) => mem._id);

      // Update give balance
      await GroupMembers.updateMany(
        { _id: { $in: groupMemberIdsExceptMe } },
        {
          $inc: { give: othersBal },
        }
      );

      //Update Getback
      await GroupMembers.findOneAndUpdate(
        { groupID, memberID: req.user.id },
        {
          $inc: { getBack: mybal },
        }
      );

      const membersExceptMeIds = membersExceptMe.map((mem) => mem.memberID);

      // Update owed to me for current user
      membersExceptMe.map(async (mem) => {
        await User.findByIdAndUpdate(req.user.id, {
          $addToSet: {
            owedToMe: {
              memberID: mem.memberID,
              amount: roundToTwo(amount / getGroupMembers.length),
              groupID,
            },
          },
        });
      });

      // Update IOwe for other members
      await User.updateMany(
        { _id: { $in: membersExceptMeIds } },
        {
          $addToSet: {
            iOwe: {
              memberID: req.user.id,
              amount: roundToTwo(amount / getGroupMembers.length),
              groupID,
            },
          },
        }
      );

      await Group.findByIdAndUpdate(groupID, {
        $push: {
          expenses: expense._id,
        },
      });

      const groupInfo = await Group.findById(groupID, {
        groupName: 1,
        _id: 0,
      });
      const activity = new Activity({ groupID, actionBy: req.user.id });
      activity.action = `${req.user.userName} added ${getSymbolFromCurrency(
        req.user.userCurrency
      )}${amount} to "${groupInfo.groupName}" group`;
      activity.save();

      res.send('Expense Added');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
