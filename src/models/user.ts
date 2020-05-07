import { Document, model, Schema } from 'mongoose';
// used for hashing user passwords
import bcrypt from 'bcrypt';

interface IUserSchema extends Document {
  email: string;
  password: string;
}

interface IUserModel extends IUserSchema {
  isValidPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema({
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
UserSchema.pre<IUserSchema>('save', async function (next) {
  // hash the password with a salt round of 10 - the higher the rounds the more secure
  // but the slower the response
  const hash = await bcrypt.hash(this.password, 10);
  // replace the plain text password with the hash and then store it
  this.password = hash;
  // move on to the next middleware
  next();
});

// used to make sure the user logging in has the correct credentials
UserSchema.methods.isValidPassword = async function (password: string) {
  // hashes password sent by user for login and checks if hashed password stored in the
  // database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

export default model<IUserModel>('User', UserSchema);
