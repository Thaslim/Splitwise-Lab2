import express from 'express';
export const router = express.Router();
import auth from '../../../middleware/auth.js';
import { splitwisedb } from '../../../config/database.js';

// @route POST api/activity
// @desc Update profile information
// @access Private
router.get('/', auth, async (req, res) => {
  const getGroups = await splitwisedb.getGroupsList(req.user.key);

  try {
    const unres = getGroups.map(async (ele) => {
      return await splitwisedb.getActivity(ele.groupID);
    });

    const myactivity = await Promise.all(unres);
    const mergeed = myactivity.flat(1);
    res.json({
      myactivity: mergeed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
