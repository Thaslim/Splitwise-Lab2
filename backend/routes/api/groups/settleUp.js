import express from 'express';
const router = express.Router();
import passport from 'passport';
import getSymbolFromCurrency from 'currency-symbol-map';
import User from '../../../models/User.js';
import _ from 'lodash';
import Activity from '../../../models/Activity.js';
import GroupMembers from '../../../models/GroupMembers.js';
import Group from '../../../models/Group.js';

export default router;

const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

// @route POST api/settle
// @desc Update profile information
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { settleWithID } = req.body;
    try {
      const currentUserBal = await User.findOneAndUpdate(
        { _id: req.user.id },

        {
          $pull: {
            iOwe: { memberID: settleWithID },
            owedToMe: { memberID: settleWithID },
          },
        },
        { select: { owedToMe: 1, iOwe: 1, _id: 0 }, multi: true }
      );

      const settleWithName = await User.findOneAndUpdate(
        { _id: settleWithID },

        {
          $pull: {
            owedToMe: { memberID: req.user.id },
            iOwe: { memberID: req.user.id },
          },
        },
        { select: { userName: 1, _id: 0 }, multi: true }
      );

      const groups1 = currentUserBal.iOwe.filter((ele) => {
        return String(ele.memberID) === String(settleWithID);
      });

      const groupMembersBalance1 = _(groups1)
        .groupBy('groupID')
        .map((obj, key) => ({
          groupID: key,
          amount: roundToTwo(_.sumBy(obj, 'amount')),
        }))
        .value();

      const groups2 = currentUserBal.owedToMe.filter((ele) => {
        return String(ele.memberID) === String(settleWithID);
      });

      const groupMembersBalance2 = _(groups2)
        .groupBy('groupID')
        .map((obj, key) => ({
          groupID: key,
          amount: roundToTwo(_.sumBy(obj, 'amount')),
        }))
        .value();

      groupMembersBalance1.map(async (ele) => {
        await GroupMembers.findOneAndUpdate(
          { groupID: ele.groupID, memberID: settleWithID },
          { $inc: { getBack: -ele.amount } }
        );
        await GroupMembers.findOneAndUpdate(
          { groupID: ele.groupID, memberID: req.user.id },
          { $inc: { give: -ele.amount } }
        );
        const groupName = await Group.findById(ele.groupID, {
          groupName: 1,
          _id: 0,
        });
        console.log(groupName);
        const activity = new Activity({
          actionBy: req.user.id,
          action: `${req.user.userName} paid ${getSymbolFromCurrency(
            req.user.userCurrency
          )}${ele.amount} in group "${groupName.groupName}"`,
          groupID: ele.groupID,
        });
        activity.save();
      });

      groupMembersBalance2.map(async (ele) => {
        await GroupMembers.findOneAndUpdate(
          { groupID: ele.groupID, memberID: settleWithID },
          { $inc: { give: -ele.amount } }
        );
        await GroupMembers.findOneAndUpdate(
          { groupID: ele.groupID, memberID: req.user.id },
          { $inc: { getBack: -ele.amount } }
        );

        const groupName = await Group.findById(ele.groupID, {
          groupName: 1,
          _id: 0,
        });

        const activity = new Activity({
          actionBy: settleWithID,
          action: `${settleWithName.userName} paid ${getSymbolFromCurrency(
            req.user.userCurrency
          )}${ele.amount} in group "${groupName.groupName}"`,
          groupID: ele.groupID,
        });
        activity.save();
      });

      res.send('Settled');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
