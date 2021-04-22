import Expense from '../../models/Expense.js';
import Group from '../../models/Group.js';
import Activity from '../../models/Activity.js';

const res = {};

const comment_handle = (myData, callback) => {
  const action = myData.action;
  if (action === 'getComments') {
    return getComments(myData, callback);
  }
  if (action === 'postComments') {
    return postComments(myData, callback);
  }
  if (action === 'deleteComments') {
    return deleteComments(myData, callback);
  }
};

// @route GET api/expense/
// @desc Get comment
// @access Private
const getComments = async (myData, callback) => {
  try {
    const getComments = await Expense.findById(myData.expenseID, {
      messages: 1,
    });
    res.status = 200;
    res.message = getComments.messages;
    return callback(null, res);
  } catch (error) {
    console.log(error);
    res.message = 'server Error';
    return callback(res, null);
  }
};

// @route POST api/expense/
// @desc Post Comment
// @access Private
const postComments = async (myData, callback) => {
  try {
    const getComments = await Expense.findByIdAndUpdate(
      myData.expenseID,
      {
        $push: { messages: { from: myData.fromName, message: myData.comment } },
      },
      { select: ['messages'], new: true }
    );
    const group = await Group.findOne(
      { expenses: myData.expenseID },
      { _id: 1 }
    );
    const expenseName = await Expense.findById(myData.expenseID, {
      description: 1,
    });

    const activity = new Activity({
      actionBy: myData.userID,
      groupID: group._id,
    });
    activity.action = `${myData.fromName} commented on "${expenseName.description}": ${myData.comment}`;
    await activity.save();

    res.status = 200;
    res.message = getComments.messages;
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

// @route POST api/expense/
// @desc delete comment
// @access Private
const deleteComments = async (myData, callback) => {
  try {
    const getComments = await Expense.findByIdAndUpdate(
      myData.expenseID,
      { $pull: { messages: { _id: myData.commentID } } },
      { select: ['messages'], new: true }
    );

    res.status = 200;
    res.message = getComments.messages;
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

export default comment_handle;
