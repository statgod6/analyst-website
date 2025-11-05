import mongoose, { Schema, model, models } from 'mongoose'

export interface IUser {
  _id: string
  email: string
  password: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'viewer'],
      default: 'viewer',
    },
    avatar: String,
  },
  {
    timestamps: true,
  }
)

export default models.User || model<IUser>('User', UserSchema)
