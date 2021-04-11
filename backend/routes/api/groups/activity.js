import express from 'express';
import passport from 'passport';
import User from '../../../models/User.js';
import Activity from '../../../models/Activity.js';

const router = express.Router();
export default router;

// @route POST api/activity
// @desc Update profile information
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const myGroups = await User.findById(req.user.id, { groups: 1, _id: 0 });
      const myactivity = await Activity.find({
        groupID: { $in: myGroups.groups },
      });
      res.send({ myactivity });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
