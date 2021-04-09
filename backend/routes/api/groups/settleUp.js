import express from 'express';
const router = express.Router();
import passport from 'passport';
import User from '../../../models/User.js';
import Group from '../../../models/Group.js';
import _ from 'lodash';

export default router;

const roundToTwo = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

const updateBalances = async (userID, settleWithID, filter) => {
  let id1;
  let id2;
  let groupInfo;
  let settleWithMember;
  let settledByMember;
  let balance1;
  let relatedBals1;
  let balance2;
  let relatedBals2;
  if (filter === 'give') {
    id1 = userID;
    id2 = settleWithID;

    balance1 = await User.findById(userID, {
      iOwe: 1,
      _id: 0,
    });

    relatedBals1 = balance1.iOwe.filter((ele) => {
      return String(ele.memberID) === String(settleWithID);
    });

    balance2 = await User.findById(settleWithID, {
      owedToMe: 1,
      _id: 0,
    });

    relatedBals2 = balance2.owedToMe.filter((ele) => {
      return String(ele.memberID) === String(userID);
    });

    const ids = relatedBals1.map((x) => x._id);
    await User.updateOne(
      { _id: userID },
      { $pull: { iOwe: { _id: { $in: ids } } } },
      { multi: true }
    );
    const ids2 = relatedBals2.map((x) => x._id);
    await User.updateOne(
      { _id: settleWithID },
      { $pull: { owedToMe: { _id: { $in: ids2 } } } },
      { multi: true }
    );
  } else {
    id1 = settleWithID;
    id2 = userID;

    balance1 = await User.findById(userID, {
      owedToMe: 1,
      _id: 0,
    });

    relatedBals1 = balance1.owedToMe.filter((ele) => {
      return String(ele.memberID) === String(settleWithID);
    });

    balance2 = await User.findById(settleWithID, {
      iOwe: 1,
      _id: 0,
    });

    relatedBals2 = balance2.iOwe.filter((ele) => {
      return String(ele.memberID) === String(userID);
    });

    const ids = relatedBals1.map((x) => x._id);
    await User.updateOne(
      { _id: userID },
      { $pull: { owedToMe: { _id: { $in: ids } } } },
      { multi: true }
    );
    const ids2 = relatedBals2.map((x) => x._id);
    await User.updateOne(
      { _id: settleWithID },
      { $pull: { iOwe: { _id: { $in: ids2 } } } },
      { multi: true }
    );
  }

  //Add activity
  const balance = _(relatedBals1)
    .groupBy('groupID')
    .map((obj, key) => ({
      groupID: key,
      amount: roundToTwo(_.sumBy(obj, 'amount')),
    }))
    .value();

  balance.map(async (bal) => {
    groupInfo = await Group.findById(bal.groupID, {
      members: 1,
      _id: 0,
    });

    settleWithMember = groupInfo.members.filter((mem) => {
      return String(mem.memberID) === String(settleWithID);
    });
    settledByMember = groupInfo.members.filter((mem) => {
      return String(mem.memberID) === String(userID);
    });
    if (filter === 'give') {
      await Group.findOneAndUpdate(
        {
          _id: bal.groupID,
          members: { $elemMatch: { memberID: id1 } },
        },
        {
          $set: {
            'members.$.give': roundToTwo(settledByMember[0].give - bal.amount),
          },
        }
      );

      await Group.findOneAndUpdate(
        {
          _id: bal.groupID,
          members: { $elemMatch: { memberID: id2 } },
        },
        {
          $set: {
            'members.$.getBack': roundToTwo(
              settleWithMember[0].getBack - bal.amount
            ),
          },
        }
      );
    } else {
      await Group.findOneAndUpdate(
        {
          _id: bal.groupID,
          members: { $elemMatch: { memberID: id2 } },
        },
        {
          $set: {
            'members.$.give': roundToTwo(
              settledByMember[0].getBack - bal.amount
            ),
          },
        }
      );

      await Group.findOneAndUpdate(
        {
          _id: bal.groupID,
          members: { $elemMatch: { memberID: id1 } },
        },
        {
          $set: {
            'members.$.getBack': roundToTwo(
              settleWithMember[0].give - bal.amount
            ),
          },
        }
      );
    }
  });

  return 'Settled';
};

// @route POST api/settle
// @desc Update profile information
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { settleWithID, giveOrGetBack } = req.body;

    try {
      const settle = await updateBalances(
        req.user.id,
        settleWithID,
        giveOrGetBack
      );

      res.send(settle);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
