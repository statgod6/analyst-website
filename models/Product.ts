import { Schema, model, models } from 'mongoose'

export interface IProduct {
  _id: string
  name: string
  slug: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  type: 'ai-prompts' | 'ai-guides' | 'ai-agents' | 'ai-automation' | 'ai-templates'
  description: string
  summary: string
  valuePropositions: string[]
  features: string[]
  targetAudience: string
  coverImage: string
  previewImages: string[]
  samplePDF?: string
  price: number
  currency: string
  discount: {
    active: boolean
    percentage: number
    expiresAt?: Date
  }
  fileUrl: string
  fileSize: string
  fileFormat: string
  pageCount: number
  testimonials: {
    author: string
    role: string
    company?: string
    location?: string
    content: string
    rating: number
  }[]
  purchaseCount: number
  rating: number
  status: 'active' | 'inactive' | 'coming-soon'
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    type: {
      type: String,
      enum: ['ai-prompts', 'ai-guides', 'ai-agents', 'ai-automation', 'ai-templates'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    summary: {
      type: String,
      maxlength: 200,
    },
    valuePropositions: [String],
    features: [String],
    targetAudience: String,
    coverImage: {
      type: String,
      required: true,
    },
    previewImages: [String],
    samplePDF: String,
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    discount: {
      active: {
        type: Boolean,
        default: false,
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      expiresAt: Date,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: String,
    fileFormat: {
      type: String,
      default: 'PDF',
    },
    pageCount: Number,
    testimonials: [
      {
        author: String,
        role: String,
        company: String,
        location: String,
        content: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    purchaseCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'coming-soon'],
      default: 'active',
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Indexes for performance
ProductSchema.index({ name: 'text', description: 'text' })
ProductSchema.index({ status: 1 })
ProductSchema.index({ type: 1 })

export default models.Product || model<IProduct>('Product', ProductSchema)
