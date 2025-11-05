import { Schema, model, models, Types } from 'mongoose'

export interface IBlog {
  _id: string
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  ogImage?: string
  excerpt: string
  content: string
  featuredImage: string
  imageAlt: string
  category: 'Political Analysis' | 'Business Policy' | 'Economic Strategy' | 'Global Affairs'
  tags: string[]
  sections: {
    type: 'intro' | 'analysis' | 'data' | 'takeaway' | 'conclusion'
    heading: string
    content: string
  }[]
  internalLinks: {
    text: string
    url: string
  }[]
  externalReferences: {
    title: string
    url: string
    source: string
  }[]
  author: Types.ObjectId | string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: Date
  readingTime: number
  views: number
  relatedPosts: (Types.ObjectId | string)[]
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    metaTitle: {
      type: String,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      maxlength: 160,
    },
    keywords: [String],
    ogImage: String,
    excerpt: {
      type: String,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    featuredImage: {
      type: String,
      required: true,
    },
    imageAlt: String,
    category: {
      type: String,
      enum: ['Political Analysis', 'Business Policy', 'Economic Strategy', 'Global Affairs'],
      required: true,
    },
    tags: [String],
    sections: [
      {
        type: {
          type: String,
          enum: ['intro', 'analysis', 'data', 'takeaway', 'conclusion'],
        },
        heading: String,
        content: String,
      },
    ],
    internalLinks: [
      {
        text: String,
        url: String,
      },
    ],
    externalReferences: [
      {
        title: String,
        url: String,
        source: String,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: Date,
    readingTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    relatedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Indexes for performance
BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text' })
BlogSchema.index({ category: 1, status: 1 })
BlogSchema.index({ publishedAt: -1 })

export default models.Blog || model<IBlog>('Blog', BlogSchema)
