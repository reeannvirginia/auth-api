"use strict";
// mdw to handle user registration and login
// will be plugged into routes and used for auth
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const user_1 = __importDefault(require("../models/user"));
const constants_1 = require("../constants");
// mdw for sign up
passport_1.default.use('signup', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // save user info to db
        const user = yield user_1.default.create({ email, password });
        // send user info to next mdw
        return done(null, user);
    }
    catch (error) {
        done(error);
    }
})));
// mdw for login
passport_1.default.use('login', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find user associated with email
        const user = yield user_1.default.findOne({ email });
        if (!user)
            return done(null, false, { message: constants_1.NO_USER });
        // validate password
        const validate = yield user.isValidPassword(password);
        if (!validate)
            return done(null, false, { message: constants_1.INVALID_PASSWORD });
        // send user info to next mdw
        return done(null, user, { message: constants_1.LOGGED_IN });
    }
    catch (error) {
        return done(error);
    }
})));
// used to extract the JWT sent by the user
// verify token sent by user is valid
passport_1.default.use(new passport_jwt_1.Strategy({
    // secret used to sign our JWT
    secretOrKey: 'top_secret',
    // we expect the user to send the token as a query parameter with the name 'secret_token'
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromUrlQueryParameter('secret_token'),
}, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // pass user details to next mdw
        return done(null, token.user);
    }
    catch (error) {
        done(error);
    }
})));
//# sourceMappingURL=auth.js.map