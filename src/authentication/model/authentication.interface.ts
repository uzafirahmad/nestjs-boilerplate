import { Document, Types } from 'mongoose';

export interface User extends Document {
  id: string;
  email: string;
  password: string;
  username: string;
}

export interface BlacklistedRefreshToken extends Document {
  token: string;
  dateAdded: Date;
}

export interface RefreshToken extends Document {
  refreshToken: string;
  expires: Date;
  user: Types.ObjectId;
}
