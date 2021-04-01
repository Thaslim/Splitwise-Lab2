import express from 'express';
const router = express.Router();
import passport from 'passport';
import User from '../../../models/User.js';
import Group from '../../../models/Group.js';

export default router;

const findInArray = (arrObj, id) => {
  const found = arrObj.find((element) => element.idExpense === id);
  return found;
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
      if (giveOrGetBack === 'give') {
        const relatedGives = await User.find(
          { _id: req.user.id },
          {
            iOwe: {
              $elemMatch: {
                memberID: settleWithID,
              },
            },
          }
        );
        res.send(relatedGives);
      }

      if (giveOrGetBack === 'getBack') {
        const relatedGets = await User.find(
          { _id: req.user.id },
          {
            owedToMe: {
              $elemMatch: {
                memberID: settleWithID,
              },
            },
          }
        );
        res.send(relatedGets);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
