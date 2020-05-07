"use strict";
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
const mongoose_1 = require("mongoose");
// used for hashing user passwords
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
// a pre-hook is called before the user info is stored in the db
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // hash the password with a salt round of 10 - the higher the rounds the more secure
        // but the slower the response
        const hash = yield bcrypt_1.default.hash(this.password, 10);
        // replace the plain text password with the hash and then store it
        this.password = hash;
        // move on to the next middleware
        next();
    });
});
// used to make sure the user logging in has the correct credentials
UserSchema.methods.isValidPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        // hashes password sent by user for login and checks if hashed password stored in the
        // database matches the one sent. Returns true if it does else false.
        const compare = yield bcrypt_1.default.compare(password, this.password);
        return compare;
    });
};
exports.default = mongoose_1.model('User', UserSchema);
//# sourceMappingURL=user.js.map