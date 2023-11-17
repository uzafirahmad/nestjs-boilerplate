import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export const BlacklistedRefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now }
});

export const RefreshTokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expires: {
    type: Date,
    default: () => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 10); // Add 10 days
      return currentDate;
    }
  }
});