import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import validator from 'express-validator';
import passport from 'passport';
import User from '../../../models/User.js';
import Group from '../../../models/Group.js';
import GroupMembers from '../../../models/GroupMembers.js';
import Activity from '../../../models/Activity.js';
import uuid from 'uuid';

const { check, validationResult } = validator;

const router = express.Router();
export default router;

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const storage = multer.memoryStorage({
  destination(_req, _file, callback) {
    callback(null, '');
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(
      new Error(
        'File type not supported. Allowed extensions are .jpb, .jpeg, .png'
      )
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

const getUniqueListBy = (arr, key) => [
  ...new Map(arr.map((item) => [item[key], item])).values(),
];

// @route post api/my-groups/accept-invitation
// @desc accept group invitation
// @access Private
router.post(
  '/accept-invitation',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { groupID, groupName } = req.body;

    try {
      const createdBy = await Group.findById(groupID, {
        createdBy: 1,
        _id: 0,
      }).populate({ path: 'createdBy', select: ['userName'] });

      const member = new GroupMembers({ groupID, memberID: req.user.id });
      member.save();

      const activity = new Activity({ actionBy: req.user.id, groupID });
      activity.action = `${createdBy.createdBy.userName} added ${req.user.userName} to the group "${groupName}"`;
      activity.save();

      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { groups: groupID },
        $pull: {
          invites: groupID,
        },
      });

      res.json('Invitation Accepted');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);

// @route post api/my-groups/leave-group
// @desc reject group invitation
// @access Private
router.post(
  '/leave-group',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { groupID, groupName } = req.body;

    try {
      const currentUserBalances = await User.findById(req.user.id, {
        iOwe: 1,
        owedToMe: 1,
        _id: 0,
      });
      const groups1 = currentUserBalances.iOwe.filter((ele) => {
        return String(ele.groupID) === String(groupID);
      });
      const groups2 = currentUserBalances.owedToMe.filter((ele) => {
        return String(ele.groupID) === String(groupID);
      });

      if (groups1.length || groups2.length) {
        return res.status(400).json({
          errors: [
            {
              msg: `Settle up all the balances before leaving the group`,
            },
          ],
        });
      }

      await GroupMembers.deleteOne({ groupID, memberID: req.user.id });
      await User.findByIdAndUpdate(req.user.id, { $pull: { groups: groupID } });
      const activity = new Activity({
        actionBy: req.user.id,
        action: `${req.user.userName} left from the group ${groupName}`,
        groupID,
      });
      activity.save();
      res.send('left from group');
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  }
);

// @route GET api/my-groups/
// @desc Get current user's groups
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const mygroupList = await User.findById(req.user.id, {
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

      res.json({
        mygroupList,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

// @route POST api/my-groups/update-group/
// @desc Update group information
// @access Private

router.post(
  '/update-group',
  [
    upload.single('selectedFile'),
    passport.authenticate('jwt', { session: false }),
    [check('groupName', "First name can't be blank").not().isEmpty()],
  ],
  async (req, res) => {
    const userID = req.user.id;
    let groupPicture;
    const { groupID, groupName } = req.body;
    if (req.file) {
      const myFile = req.file.originalname.split('.');
      const fileType = myFile[myFile.length - 1];

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}.${fileType}`,
        Body: req.file.buffer,
      };

      S3.upload(params, (error) => {
        if (error) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Error uploading file' }] });
        }
      });
      groupPicture = params.Key;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const groupInfo = await Group.findById(groupID, { groupName: 1 });
      if (groupInfo.groupName !== groupName) {
        const myGroupNames = await User.findOne({ _id: userID }, { groups: 1 })
          .populate('groups', '-_id groupName')
          .select(['-_id']);
        const checkUniqueGroupNames = myGroupNames.groups.filter(
          (el) => el.groupName === groupName
        );

        if (checkUniqueGroupNames.length) {
          return res.status(400).json({
            errors: [
              {
                msg: `Whoops! ${groupName} group already exists`,
              },
            ],
          });
        }
      }

      const GroupFields = { groupName, groupPicture };

      await Group.findByIdAndUpdate(groupID, {
        $set: GroupFields,
      });

      if (groupPicture) {
        const activity = new Activity({
          actionBy: req.user.id,
          action: `${req.user.userName} updated cover photo for "${groupName}"`,
          groupID,
        });
        activity.save();
      }

      return res.json('Updated');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
