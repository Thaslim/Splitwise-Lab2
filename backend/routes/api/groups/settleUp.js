import express from 'express';
import passport from 'passport';
import make_request from '../../../kafka/client.js';

const router = express.Router();
export default router;

// @route POST api/settle
// @desc Update profile information
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { settleWithID } = req.body;
    const myData = {
      action: 'settleup',
      userID: req.user.id,
      settleWithID,
      userCurrency: req.user.userCurrency,
      userName: req.user.userName,
    };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).send(results.message);
      }
    });
  }
);
