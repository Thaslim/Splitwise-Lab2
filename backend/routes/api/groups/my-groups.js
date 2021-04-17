import express from 'express';
import validator from 'express-validator';
import passport from 'passport';
import { S3 } from '../../../config/s3.js';
import { uploadSingle } from '../../../config/multer.js';
import uuid from 'uuid';
import make_request from '../../../kafka/client.js';

const { check, validationResult } = validator;

const router = express.Router();
export default router;

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
    const myData = {
      action: 'acceptInvitations',
      userID: req.user.id,
      groupID,
      groupName,
      userName: req.user.userName,
    };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json(results.message);
      }
    });
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
    const myData = {
      action: 'leaveGroup',
      userID: req.user.id,
      groupID,
      groupName,
      userName: req.user.userName,
    };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json(results.message);
      }
    });
  }
);

// @route GET api/my-groups/
// @desc Get current user's groups
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const myData = {
      action: 'getAcceptedGroups',
      userID: req.user.id,
    };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json({ mygroupList: results.message });
      }
    });
  }
);

// @route POST api/my-groups/update-group/
// @desc Update group information
// @access Private

router.post(
  '/update-group',
  [
    uploadSingle.single('selectedFile'),
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

    const myData = {
      action: 'updateGroup',
      userID: req.user.id,
      userName: req.user.userName,
      groupName,
      groupID,
      groupPicture,
    };
    make_request('groups', myData, (err, results) => {
      if (err) {
        res.status(500).json({
          errors: [{ msg: err }],
        });
      } else {
        res.status(200).json(results.message);
      }
    });
  }
);
