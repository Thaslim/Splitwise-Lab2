import express from 'express';
import phone from 'phone';
import validator from 'express-validator';
import passport from 'passport';
import dotenv from 'dotenv';
import uuid from 'uuid';
import { S3 } from '../../../config/s3.js';
import { uploadSingle } from '../../../config/multer.js';
import make_request from '../../../kafka/client.js';

dotenv.config({ path: './config/.env' });
const { check, validationResult } = validator;
const router = express.Router();
export default router;

// @route POST api/me
// @desc Update profile information
// @access Private

router.post(
  '/',
  [
    uploadSingle.single('selectedFile'),
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

    const myData = {
      action: 'updateProfile',
      userID: req.user.id,
      userName,
      userEmail,
      userValidPhone,
      filepath,
      userCurrency,
      userTimezone,
      userLanguage,
    };
    make_request('users', myData, (err, results) => {
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
