/* eslint-disable comma-dangle */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import express from 'express';
import path from 'path';
import multer from 'multer';
import validator from 'express-validator';
import passport from 'passport';
import User from '../../../models/User.js';
import Group from '../../../models/Group.js';

const dirname = path.resolve(path.dirname(''));
const { check, validationResult } = validator;

const destPath = `${dirname}/public/uploaded_images/groups`;
const router = express.Router();
export default router;
const storage = multer.diskStorage({
  destination: destPath,
  filename: (req, file, cb) => {
    cb(null, `group_${file.originalname}`);
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

// router.post(
//   '/update-group/',
//   [
//     upload.single('selectedFile'),
//     passport.authenticate('jwt', { session: false }),
//     [check('groupName', "First name can't be blank").not().isEmpty()],
//   ],
//   async (req, res) => {
//     let selectedFile;
//     const userID = req.user.id;

//     const { groupID, groupName } = req.body;
//     if (req.file) {
//       selectedFile = req.file.filename;
//     }

//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const checkUniqueGroupName = await splitwisedb.checkGroupName(name, userID);
//       if (checkUniqueGroupName.length > 0) {
//         return res.status(400).json({
//           errors: [
//             {
//               msg: `Whoops! ${name} group already exists`,
//             },
//           ],
//         });
//       }
//       const updatedGroup = await splitwisedb.updateGroup(
//         req.params.group_id,
//         name,
//         selectedFile,
//       );

//       return res.json(updatedGroup);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server error');
//     }
//   },
// );
