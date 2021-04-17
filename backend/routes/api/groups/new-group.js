import express from 'express';
import AWS from 'aws-sdk';
import uuid from 'uuid';
import validator from 'express-validator';
import passport from 'passport';
import multer from 'multer';
import User from '../../../models/User.js';
import Group from '../../../models/Group.js';
import GroupMembers from '../../../models/GroupMembers.js';
import Activity from '../../../models/Activity.js';

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
      const groupID = group.id;
      group.save();

      const gm = new GroupMembers({ groupID, memberID: req.user.id });
      gm.save();

      const activity = new Activity({ actionBy: req.user.id, groupID });
      activity.action = `${req.user.userName} created "${groupName}" group`;
      activity.save();

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
        $push: { groups: groupID },
      });
      await User.updateMany(
        { _id: { $in: ids } },
        {
          $push: { invites: groupID },
        }
      );

      res.status(200).json({ message: 'Successfully created group!' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
