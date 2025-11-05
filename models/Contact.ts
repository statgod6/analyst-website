import { Schema, model, models } from 'mongoose'

export interface IContact {
  _id: string
  name: string
  email: string
  organization?: string
  inquiryType: string
  budget?: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    inquiryType: {
      type: String,
      required: [true, 'Inquiry type is required'],
      enum: ['ai-consulting', 'custom-prompts', 'collaboration', 'bulk-purchase', 'general'],
    },
    budget: {
      type: String,
      enum: ['under-5k', '5k-10k', '10k-25k', '25k-50k', 'over-50k', ''],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
ContactSchema.index({ email: 1 })
ContactSchema.index({ status: 1 })
ContactSchema.index({ createdAt: -1 })

export default models.Contact || model<IContact>('Contact', ContactSchema)
