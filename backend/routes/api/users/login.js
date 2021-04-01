import express from 'express';
import dotenv from 'dotenv';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'express-validator';
import passport from 'passport';
import User from '../../../models/User.js';

const { check, validationResult } = validator;

dotenv.config({ path: './config/.env' });
const router = express.Router();
export default router;

// @route GET api/login
// @desc login page
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route POST api/login
// @desc Authenticate user and get token
// @access Public
router.post(
  '/',
  [
    check('userEmail', 'Enter a valid email').isEmail(),
    check('userPassword', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userEmail, userPassword } = req.body;

    try {
      const user = await User.findOne({ userEmail }, { userPassword: 1 });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg:
                'Whoops! We couldn’t find an account for that email address and password',
            },
          ],
        });
      }

      // Compare password
      const matchPwd = await bcrypt.compare(userPassword, user.userPassword);

      if (!matchPwd) {
        return res.status(400).json({
          errors: [
            {
              msg:
                'Whoops! We couldn’t find an account for that email address and password',
            },
          ],
        });
      }

      const payload = {
        user: {
          email: userEmail,
          id: user.id,
          name: user.userName,
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
