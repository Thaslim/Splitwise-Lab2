import express from 'express';
import phone from 'phone';
import validator from 'express-validator';
import passport from 'passport';
import multer from 'multer';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import uuid from 'uuid';
import User from '../../../models/User.js';

dotenv.config({ path: './config/.env' });
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

// @route POST api/me
// @desc Update profile information
// @access Private

router.post(
  '/',
  [
    upload.single('selectedFile'),
    passport.authenticate('jwt', { session: false }),
    [
      check('userName', "First name can't be blank").not().isEmpty(),
      check('userEmail', 'Enter a valid email').isEmail(),
    ],
  ],
  async (req, res) => {
    let filepath;
    const {
      userName,
      userEmail,
      userPhone,
      userCurrency,
      userTimezone,
      userLanguage,
    } = req.body;
    if (req.file) {
      const myFile = req.file.originalname.split('.');
      const fileType = myFile[myFile.length - 1];

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}.${fileType}`,
        Body: req.file.buffer,
      };
      filepath = params.Key;
      S3.upload(params, (error) => {
        if (error) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Error uploading file' }] });
        }
      });
    }
    const errors = validationResult(req);
    let validPhone;
    let userValidPhone;
    if (userPhone) {
      validPhone = phone(userPhone);
      [userValidPhone] = validPhone;
      if (!validPhone.length) {
        return res
          .status(400)
          .json({ errors: [{ msg: `${userPhone} not a valid phone number` }] });
      }
    }
    if (!validPhone) {
      userValidPhone = '';
    }
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await User.findById(req.user.id);

      const userFields = {};
      if (userName && profile.userName !== userName) {
        userFields.userName = userName;
      }
      if (userEmail && profile.userEmail !== userEmail) {
        const emailExists = await User.findOne({ userEmail });

        if (emailExists) {
          return res.status(400).json({
            errors: [
              { msg: `${userEmail} already belongs to another account.` },
            ],
          });
        }

        userFields.userEmail = userEmail;
      }

      if (userCurrency && profile.userCurrency !== userCurrency) {
        userFields.userCurrency = userCurrency;
      }

      if (userTimezone && profile.userTimezone !== userTimezone) {
        userFields.userTimezone = userTimezone;
      }

      if (userLanguage && profile.userLanguage !== userLanguage) {
        userFields.userLanguage = userLanguage;
      }

      if (userPhone && profile.userPhone !== userPhone) {
        userFields.userPhone = userValidPhone;
      }

      if (req.file && profile.userPicture !== filepath) {
        userFields.userPicture = filepath;
      }

      if (profile) {
        await User.findByIdAndUpdate(req.user.id, {
          $set: userFields,
        });

        res.json('Profile updated');
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  }
);
