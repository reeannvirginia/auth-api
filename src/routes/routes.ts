import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { SIGNED_UP } from '../constants';

const router = express.Router();

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res) => {
    res.json({
      message: SIGNED_UP,
      user: req.user,
    });
  }
);

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user) => {
    try {
      if (err || !user) {
        const error = new Error('An Error occurred');
        return next(error);
      }
      // session is false so we do not store user details in a session
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        // only store email and id in token
        const body = { _id: user._id, email: user.email };
        // sign jwt token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, 'top_secret');
        // send token to user
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

export default router;
