// mdw to handle user registration and login
// will be plugged into routes and used for auth

import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/user';
import { NO_USER, INVALID_PASSWORD, LOGGED_IN } from '../constants';

// mdw for sign up
passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // save user info to db
        const user = await UserModel.create({ email, password });
        // send user info to next mdw
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// mdw for login
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // find user associated with email
        const user = await UserModel.findOne({ email });
        if (!user) return done(null, false, { message: NO_USER });

        // validate password
        const validate = await user.isValidPassword(password);
        if (!validate) return done(null, false, { message: INVALID_PASSWORD });

        // send user info to next mdw
        return done(null, user, { message: LOGGED_IN });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// used to extract the JWT sent by the user
// verify token sent by user is valid
passport.use(
  new JWTstrategy(
    {
      // secret used to sign our JWT
      secretOrKey: 'top_secret',
      // we expect the user to send the token as a query parameter with the name 'secret_token'
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('secret_token'),
    },
    async (token, done) => {
      try {
        // pass user details to next mdw
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
