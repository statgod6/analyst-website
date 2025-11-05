import { Schema, model, models } from 'mongoose'

export interface IOrder {
  _id: string
  orderNumber: string
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  customerEmail: string
  customerName?: string
  customerPhone?: string
  productId: any // mongoose.Types.ObjectId
  productName: string
  amount: number
  currency: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  downloadUrl: string
  downloadCount: number
  lastDownloadedAt?: Date
  createdAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
    },
    razorpaySignature: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: false, // Optional since Razorpay may not capture it
      lowercase: true,
      trim: true,
      index: true,
    },
    customerName: String,
    customerPhone: {
      type: String,
      trim: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    downloadUrl: {
      type: String,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastDownloadedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for common queries
OrderSchema.index({ orderNumber: 1 })
OrderSchema.index({ customerEmail: 1, createdAt: -1 })
OrderSchema.index({ paymentStatus: 1, createdAt: -1 })
OrderSchema.index({ productId: 1 })

export default models.Order || model<IOrder>('Order', OrderSchema)
