/* eslint-disable comma-dangle */
import express from 'express';
import path from 'path';
import _ from 'lodash';
import passport from 'passport';
import User from '../../../models/User.js';
import Group from '../../../models/Group.js';

const router = express.Router();
export default router;

// @route GET api/dashboard
// @desc Get current user's groups
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const myGroups = await User.findById(req.user.id, { groups: 1 }).populate(
        {
          path: 'groups',
          select: ['members'],
        }
      );

      const allMembers = myGroups.groups.map((el) => el.members);
      // get sum of balance across all objects in array
      const mergedAccMembers = allMembers.flat(1);
      const uniqueMembers = _(mergedAccMembers)
        .groupBy('memberID')
        .map((obj, key) => ({
          memberID: key,
          getBack: _.sumBy(obj, 'getBack'),
          give: _.sumBy(obj, 'give'),
        }));

      const myBalance = uniqueMembers.filter(
        (mem) => mem.memberID === req.user.id
      );
      const strigifiedBalance = JSON.stringify(myBalance);
      const parseBalanvce = JSON.parse(strigifiedBalance);

      const totalBalance = parseBalanvce[0].getBack - parseBalanvce[0].give;
      res.json({ myGroups, myBalance, totalBalance });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  }
);
