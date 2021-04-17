import User from '../../models/User.js';
import Activity from '../../models/Activity.js';
import Group from '../../models/Group.js';
import GroupMembers from '../../models/GroupMembers.js';

const res = {};

const handle_newGroup = (myData, callback) => {
  const action = myData.action;
  if (action === 'getAllUsers') {
    return getAllUsers(myData, callback);
  }
  if (action === 'createNewGroup') {
    return createNewGroup(myData, callback);
  }
};
const getAllUsers = async (myData, callback) => {
  try {
    const userList = await User.find(
      { _id: { $ne: myData.userID } },
      { userName: 1, userEmail: 1, userPicture: 1 }
    );

    res.status = 200;
    res.message = userList;
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

const createNewGroup = async (myData, callback) => {
  try {
    let group = await Group.findOne({
      groupName: myData.groupName,
      createdBy: myData.userID,
    });
    if (group) {
      res.message = `Whoops! ${myData.groupName} group already exists`;
      return callback(res, null);
    }

    group = new Group({
      groupName: myData.groupName,
      createdBy: myData.userID,
      groupPicture: myData.groupPicture,
    });
    const groupID = group.id;
    group.save();

    const gm = new GroupMembers({ groupID, memberID: myData.userID });
    gm.save();

    const activity = new Activity({ actionBy: myData.userID, groupID });
    activity.action = `${myData.userName} created "${myData.groupName}" group`;
    activity.save();

    let ids = [];
    if (myData.invites) {
      const jsonInvites = JSON.parse(myData.invites);

      const memEmails = jsonInvites.map((mem) => mem.memberEmail);

      const memIds = await User.find(
        { userEmail: { $in: memEmails } },
        { projection: { _id: 1 } }
      );
      // eslint-disable-next-line no-underscore-dangle
      ids = memIds.map((mem) => mem._id);
    }

    await User.findByIdAndUpdate(myData.userID, {
      $push: { groups: groupID },
    });
    await User.updateMany(
      { _id: { $in: ids } },
      {
        $push: { invites: groupID },
      }
    );

    res.status = 200;
    res.message = 'Successfully created group!';
    return callback(null, res);
  } catch (error) {
    console.log(error);
    res.message = 'server Error';
    return callback(res, null);
  }
};

export default handle_newGroup;
