import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import validator from 'express-validator';
import passport from 'passport';
import User from '../../../models/User.js';
import Group from '../../../models/Group.js';
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
      await Group.findByIdAndUpdate(groupID, {
        $addToSet: { members: { memberID: req.user.id } },
        $push: {
          activity: {
            actionBy: req.user.id,
            action: `${req.user.userName} accepted invitation to join ${groupName} group`,
          },
        },
      });

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
// router.post('/leave-group',
// passport.authenticate('jwt', { session: false }), async (req, res) => {
//   const {groupID, groupName} = req.body;

//   try {
//     const checkBalance = await splitwisedb.getGroupBalances(groupID);
//     const stringifyBal = JSON.stringify(checkBalance);
//     const jsonBal = JSON.parse(stringifyBal);
//     if (jsonBal && jsonBal.length > 0) {
//       const found = jsonBal.find(
//         (element) => element.memberEmail === req.user.key
//       );
//       if (found && Math.abs(found.total) > 0.5) {
//         return res.status(400).json({
//           errors: [
//             {
//               msg: `Settle up all the balances before leaving the group`,
//             },
//           ],
//         });
//       }
//     }

//     const createdBy = await splitwisedb.getCreatedBy(groupID);

//     if (createdBy) {
//       if (createdBy.createdBy === req.user.id && jsonBal.length > 0) {
//         return res.status(400).json({
//           errors: [
//             {
//               msg: `Delete the group if balances with other group members are not settled up`,
//             },
//           ],
//         });
//       }
//     }
//     const rejectInvitation = await splitwisedb.rejectInvitation(
//       groupID,
//       req.user.key
//     );

//     return res.json('Rejected Invitation');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// });

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
          select: ['groupName', 'groupPicture', 'members'],
          populate: {
            path: 'members.memberID',
            select: ['userName', 'userEmail', 'userPicture'],
          },
        })
        .populate({ path: 'invites', select: ['groupName', 'groupPicture'] })
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

      return res.json('Updated');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
