import Group from '../../models/Group.js';
import Activity from '../../models/Activity.js';
import Expense from '../../models/Expense.js';
import getSymbolFromCurrency from 'currency-symbol-map';
import User from '../../models/User.js';
import GroupMembers from '../../models/GroupMembers.js';

const res = {};

const handle_groups = (myData, callback) => {
  const action = myData.action;
  if (action === 'getExpenseList') {
    return getExpenseList(myData, callback);
  }
  if (action === 'getGroupBalance') {
    return getGroupBalance(myData, callback);
  }
  if (action === 'addExpense') {
    return addExpense(myData, callback);
  }
};
const getExpenseList = async (myData, callback) => {
  try {
    const groupExpense = await Group.findById(myData.groupID, {
      expenses: 1,
    }).populate({
      path: 'expenses',
      select: ['paidByName', 'paidByEmail', 'description', 'amount', 'date'],
    });
    res.status = 200;
    res.message = groupExpense;
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

const getGroupBalance = async (myData, callback) => {
  try {
    const members = await GroupMembers.find(
      { groupID: myData.groupID },
      { _id: 0 }
    ).populate({
      path: 'memberID',
      select: ['userName', 'userEmail', 'userPicture'],
    });

    res.status = 200;
    res.message = members;
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

const addExpense = async (myData, callback) => {
  try {
    const expense = new Expense({
      description: myData.description,
      amount: myData.amount,
      paidByEmail: myData.paidByEmail,
      paidByName: myData.paidByName,
      date: myData.date,
    });
    expense.save();

    const getGroupMembers = await GroupMembers.find({
      groupID: myData.groupID,
    });

    const membersExceptMe = getGroupMembers.filter(
      (mem) => String(mem.memberID) !== String(myData.userID)
    );

    const mybal = roundToTwo(
      myData.amount - roundToTwo(myData.amount / getGroupMembers.length)
    );
    const othersBal = roundToTwo(myData.amount / getGroupMembers.length);

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
      { groupID: myData.groupID, memberID: myData.userID },
      {
        $inc: { getBack: mybal },
      }
    );

    const membersExceptMeIds = membersExceptMe.map((mem) => mem.memberID);

    // Update owed to me for current user
    membersExceptMe.map(async (mem) => {
      await User.findByIdAndUpdate(myData.userID, {
        $addToSet: {
          owedToMe: {
            memberID: mem.memberID,
            amount: roundToTwo(myData.amount / getGroupMembers.length),
            groupID: myData.groupID,
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
            memberID: myData.userID,
            amount: roundToTwo(myData.amount / getGroupMembers.length),
            groupID: myData.groupID,
          },
        },
      }
    );

    await Group.findByIdAndUpdate(myData.groupID, {
      $push: {
        expenses: expense._id,
      },
    });

    const groupInfo = await Group.findById(myData.groupID, {
      groupName: 1,
      _id: 0,
    });
    const activity = new Activity({
      groupID: myData.groupID,
      actionBy: myData.userID,
    });
    activity.action = `${myData.userName} added ${getSymbolFromCurrency(
      myData.userCurrency
    )}${myData.amount} to "${groupInfo.groupName}" group`;
    activity.save();

    res.status = 200;
    res.message = 'Expense Added';
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};
export default handle_groups;
