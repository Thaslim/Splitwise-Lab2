/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import validator from 'express-validator';
import User from '../../../models/User.js';

const { check, validationResult } = validator;

dotenv.config({ path: './config/.env' });

const router = express.Router();
export default router;

// @route POST api/users
// @desc Register user
// @access Public
router.post(
  '/',
  [
    check('userName', "First name can't be blank").not().isEmpty(),
    check('userEmail', 'Enter a valid email').isEmail(),
    check(
      'userPassword',
      'Password must be 6 or more characters long'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userName, userEmail, userPassword } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ userEmail });

      if (user) {
        return res.status(400).json({
          errors: [{ msg: `${userEmail} already belongs to another account.` }],
        });
      }
      user = new User({ userName, userEmail, userPassword });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.userPassword = await bcrypt.hash(userPassword, salt);
      user.save();

      const payload = {
        user: {
          email: userEmail,
          id: user.id,
          name: userName,
        },
      };

      // Return jsonwebtoken
      jwt.sign(
        payload,
        process.env.SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token: `Bearer ${token}` });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);
