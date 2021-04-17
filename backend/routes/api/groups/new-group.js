import express from 'express';
import uuid from 'uuid';
import validator from 'express-validator';
import passport from 'passport';
import { S3 } from '../../../config/s3.js';
import { uploadSingle } from '../../../config/multer.js';
import make_request from '../../../kafka/client.js';

const { check, validationResult } = validator;

const router = express.Router();
export default router;

// @route GET api/new-groups
// @desc Search registered Users
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const myData = { action: 'getAllUsers', userID: req.user.id };
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

// @route POST api/new-groups
// @desc Create new group
// @access Private
router.post(
  '/',
  [
    uploadSingle.single('selectedFile'),
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

    const myData = {
      action: 'createNewGroup',
      userID: req.user.id,
      groupName,
      invites,
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
