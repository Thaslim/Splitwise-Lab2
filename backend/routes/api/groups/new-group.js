/* eslint-disable import/extensions */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-return-await */
/* eslint-disable comma-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
import express from 'express';
import path from 'path';
import validator from 'express-validator';
import passport from 'passport';
import multer from 'multer';
import User from '../../../models/User.js';
import Group from '../../../models/Group.js';

const { check, validationResult } = validator;

const router = express.Router();
export default router;

const dirname = path.resolve(path.dirname(''));
const destPath = `${dirname}/public/uploaded_images/groups`;
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

// @route GET api/new-groups
// @desc Search registered Users
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userList = await User.find(
        { _id: { $ne: req.user.id } },
        { userName: 1, userEmail: 1, userPicture: 1 }
      );
      res.json(userList);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  }
);

// @route POST api/new-groups
// @desc Create new group
// @access Private

router.post(
  '/',
  [
    upload.single('selectedFile'),
    passport.authenticate('jwt', { session: false }),
    [check('groupName', "group name can't be blank").not().isEmpty()],
  ],
  async (req, res) => {
    let groupPicture;
    const { groupName, groupMembers: invites } = req.body;
    if (req.file) {
      groupPicture = req.file.filename;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let group = await Group.findOne({
        groupName,
        createdBy: req.user.id,
      });
      if (group) {
        return res.status(400).json({
          errors: [
            {
              msg: `Whoops! ${groupName} group already exists`,
            },
          ],
        });
      }

      group = new Group({ groupName, createdBy: req.user.id });
      const groupId = group.id;

      if (req.file) group.groupPicture = groupPicture;
      group.members.push(req.user.id);
      group.activity.push({
        actionBy: req.user.id,
        action: `created ${groupName} group`,
      });
      group.save();
      let ids = [];
      if (invites) {
        const jsonInvites = JSON.parse(invites);

        const memEmails = jsonInvites.map((mem) => mem.memberEmail);

        const memIds = await User.find(
          { userEmail: { $in: memEmails } },
          { projection: { _id: 1 } }
        );
        // eslint-disable-next-line no-underscore-dangle
        ids = memIds.map((mem) => mem._id);
      }

      await User.findByIdAndUpdate(req.user.id, {
        $push: { groups: groupId },
      });
      await User.updateMany(
        { _id: { $in: ids } },
        {
          $push: { invites: groupId },
        }
      );

      res.status(200).json({ message: 'Successfully created group!' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
