/* eslint-disable import/extensions */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
import express from 'express';
import phone from 'phone';
import path from 'path';
import validator from 'express-validator';
import passport from 'passport';
import multer from 'multer';
import User from '../../../models/User.js';

const { check, validationResult } = validator;
const router = express.Router();
export default router;

const dirname = path.resolve(path.dirname(''));
const destPath = `${dirname}/public/uploaded_images/users`;

const storage = multer.diskStorage({
  destination: destPath,
  filename: (req, file, cb) => {
    cb(null, `user ${file.originalname}`);
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
// @route GET api/me
// @desc Get current user's profile
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await User.findById(req.user.id).select([
        '-userPassword',
        '-date',
      ]);

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

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
      filepath = req.file.filename;
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
        const updateProfile = await User.findByIdAndUpdate(
          req.user.id,
          {
            $set: userFields,
          },
          { new: true }
        );

        return res.json(updateProfile);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  }
);
