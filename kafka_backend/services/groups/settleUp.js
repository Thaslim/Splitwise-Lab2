import User from '../../models/User.js';
import Activity from '../../models/Activity.js';
import getSymbolFromCurrency from 'currency-symbol-map';
import GroupMembers from '../../models/GroupMembers.js';
import Group from '../../models/Group.js';
import _ from 'lodash';

const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

const res = {};

const handle_settle = (myData, callback) => {
  const action = myData.action;
  if (action === 'settleup') {
    return settleup(myData, callback);
  }
};

const settleup = async (myData, callback) => {
  try {
    const currentUserBal = await User.findOneAndUpdate(
      { _id: myData.userID },

      {
        $pull: {
          iOwe: { memberID: myData.settleWithID },
          owedToMe: { memberID: myData.settleWithID },
        },
      },
      { select: { owedToMe: 1, iOwe: 1, _id: 0 }, multi: true }
    );

    const settleWithName = await User.findOneAndUpdate(
      { _id: myData.settleWithID },

      {
        $pull: {
          owedToMe: { memberID: myData.userID },
          iOwe: { memberID: myData.userID },
        },
      },
      { select: { userName: 1, _id: 0 }, multi: true }
    );

    const groups1 = currentUserBal.iOwe.filter((ele) => {
      return String(ele.memberID) === String(myData.settleWithID);
    });

    const groupMembersBalance1 = _(groups1)
      .groupBy('groupID')
      .map((obj, key) => ({
        groupID: key,
        amount: roundToTwo(_.sumBy(obj, 'amount')),
      }))
      .value();

    const groups2 = currentUserBal.owedToMe.filter((ele) => {
      return String(ele.memberID) === String(myData.settleWithID);
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
        { groupID: ele.groupID, memberID: myData.settleWithID },
        { $inc: { getBack: -ele.amount } }
      );
      await GroupMembers.findOneAndUpdate(
        { groupID: ele.groupID, memberID: myData.userID },
        { $inc: { give: -ele.amount } }
      );
      const groupName = await Group.findById(ele.groupID, {
        groupName: 1,
        _id: 0,
      });

      const activity = new Activity({
        actionBy: myData.userID,
        action: `${myData.userName} paid ${getSymbolFromCurrency(
          myData.userCurrency
        )}${ele.amount} in group "${groupName.groupName}"`,
        groupID: ele.groupID,
      });
      activity.save();
    });

    groupMembersBalance2.map(async (ele) => {
      await GroupMembers.findOneAndUpdate(
        { groupID: ele.groupID, memberID: myData.settleWithID },
        { $inc: { give: -ele.amount } }
      );
      await GroupMembers.findOneAndUpdate(
        { groupID: ele.groupID, memberID: myData.userID },
        { $inc: { getBack: -ele.amount } }
      );

      const groupName = await Group.findById(ele.groupID, {
        groupName: 1,
        _id: 0,
      });

      const activity = new Activity({
        actionBy: myData.settleWithID,
        action: `${settleWithName.userName} paid ${getSymbolFromCurrency(
          myData.userCurrency
        )}${ele.amount} in group "${groupName.groupName}"`,
        groupID: ele.groupID,
      });
      activity.save();
    });
    res.status = 200;
    res.message = 'Settled';
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

export default handle_settle;
