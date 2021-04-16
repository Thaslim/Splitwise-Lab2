import User from '../../models/User.js';
import Activity from '../../models/Activity.js';

const res = {};

const handle_activity = (myData, callback) => {
  const action = myData.action;
  if (action === 'getActivity') {
    return getActivity(myData, callback);
  }
};

const getActivity = async (myData, callback) => {
  try {
    const myGroups = await User.findById(myData.userID, { groups: 1, _id: 0 });
    const myactivity = await Activity.find({
      groupID: { $in: myGroups.groups },
    });
    res.status = 200;
    res.message = myactivity;
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

export default handle_activity;
