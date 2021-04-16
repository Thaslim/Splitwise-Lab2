import express from 'express';
import passport from 'passport';
import make_request from '../../../kafka/client.js';

const router = express.Router();
export default router;

// @route GET api/activity
// @desc Get recent activity
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const myData = { action: 'getActivity', userID: req.user.id };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json({ myactivity: results.message });
      }
    });
  }
);
