import { Document, Types } from 'mongoose';

export interface Crud extends Document {
  title: string;
  description: string;
  user: Types.ObjectId;
}
