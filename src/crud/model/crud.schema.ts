import * as mongoose from 'mongoose';

export const CrudSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User' // Reference to the User model
  }
});
