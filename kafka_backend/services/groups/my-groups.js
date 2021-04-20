import User from '../../models/User.js';
import Activity from '../../models/Activity.js';
import Group from '../../models/Group.js';
import GroupMembers from '../../models/GroupMembers.js';

const res = {};

const handle_myGroups = (myData, callback) => {
  const action = myData.action;
  if (action === 'acceptInvitations') {
    return acceptInvitations(myData, callback);
  }
  if (action === 'leaveGroup') {
    return leaveGroup(myData, callback);
  }
  if (action === 'getAcceptedGroups') {
    return getAcceptedGroups(myData, callback);
  }
  if (action === 'updateGroup') {
    return updateGroup(myData, callback);
  }
};

const acceptInvitations = async (myData, callback) => {
  try {
    const createdBy = await Group.findById(myData.groupID, {
      createdBy: 1,
      _id: 0,
    }).populate({ path: 'createdBy', select: ['userName'] });
    let member = GroupMembers.findOne({
      groupID: myData.groupID,
      memberID: myData.userID,
    });
    if (!member.length) {
      member = new GroupMembers({
        groupID: myData.groupID,
        memberID: myData.userID,
      });
      await member.save();

      const activity = new Activity({
        actionBy: myData.userID,
        groupID: myData.groupID,
      });
      activity.action = `${createdBy.createdBy.userName} added ${myData.userName} to the group "${myData.groupName}"`;
      await activity.save();

      await User.findByIdAndUpdate(myData.userID, {
        $addToSet: { groups: myData.groupID },
        $pull: {
          invites: myData.groupID,
        },
      });
      res.status = 200;
      res.message = 'Invitation Accepted';
      return callback(null, res);
    }
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

const leaveGroup = async (myData, callback) => {
  try {
    const currentUserBalances = await User.findById(myData.userID, {
      iOwe: 1,
      owedToMe: 1,
      _id: 0,
    });
    const groups1 = currentUserBalances.iOwe.filter((ele) => {
      return String(ele.groupID) === String(myData.groupID);
    });
    const groups2 = currentUserBalances.owedToMe.filter((ele) => {
      return String(ele.groupID) === String(myData.groupID);
    });

    if (groups1.length || groups2.length) {
      res.message = 'Settle up all the balances before leaving the group';
      return callback(res, null);
    }

    await GroupMembers.deleteOne({
      groupID: myData.groupID,
      memberID: myData.userID,
    });
    await User.findByIdAndUpdate(myData.userID, {
      $pull: { groups: myData.groupID },
    });
    const activity = new Activity({
      actionBy: myData.userID,
      action: `${myData.userName} left from the group ${myData.groupName}`,
      groupID: myData.groupID,
    });
    await activity.save();
    res.status = 200;
    res.message = 'left from group';
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

const getAcceptedGroups = async (myData, callback) => {
  try {
    const mygroupList = await User.findById(myData.userID, {
      groups: 1,
      invites: 1,
      iOwe: 1,
      owedToMe: 1,
      _id: 0,
    })
      .populate({
        path: 'groups',
        select: ['groupName', 'groupPicture'],
      })
      .populate({
        path: 'invites',
        select: ['groupName', 'groupPicture'],
      })
      .populate({
        path: 'iOwe.memberID',
        select: ['userName', 'userEmail', 'userPicture'],
      })
      .populate({
        path: 'owedToMe.memberID',
        select: ['userName', 'userEmail', 'userPicture'],
      })
      .populate({
        path: 'owedToMe.groupID',
        select: ['groupName'],
      })
      .populate({
        path: 'iOwe.groupID',
        select: ['groupName'],
      });

    if (!mygroupList) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Whoops! You dont belong to any groups yet!',
          },
        ],
      });
    }
    res.status = 200;
    res.message = mygroupList;
    return callback(null, res);
  } catch (error) {
    res.message = 'server Error';
    return callback(res, null);
  }
};

const updateGroup = async (myData, callback) => {
  try {
    const groupInfo = await Group.findById(myData.groupID, { groupName: 1 });
    if (groupInfo.groupName !== myData.groupName) {
      const myGroupNames = await User.findOne(
        { _id: myData.userID },
        { groups: 1 }
      )
        .populate('groups', '-_id groupName')
        .select(['-_id']);
      const checkUniqueGroupNames = myGroupNames.groups.filter(
        (el) => el.groupName === myData.groupName
      );

      if (checkUniqueGroupNames.length) {
        return res.status(400).json({
          errors: [
            {
              msg: `Whoops! ${myData.groupName} group already exists`,
            },
          ],
        });
      }
    }

    const GroupFields = {
      groupName: myData.groupName,
      groupPicture: myData.groupPicture,
    };

    await Group.findByIdAndUpdate(myData.groupID, {
      $set: GroupFields,
    });

    if (myData.groupPicture) {
      const activity = new Activity({
        actionBy: myData.userID,
        action: `${myData.userName} updated cover photo for "${myData.groupName}"`,
        groupID: myData.groupID,
      });
      await activity.save();
    }
    res.status = 200;
    res.message = 'Updated';
    return callback(null, res);
  } catch (error) {
    console.log(error);
    res.message = 'server Error';
    return callback(res, null);
  }
};

export default handle_myGroups;
