import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Increase connection pool size
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('❌ MongoDB connection error:', e instanceof Error ? e.message : 'Unknown error')
    console.log('ℹ️  The app will continue without database connection')
    console.log('ℹ️  To fix: Whitelist your IP in MongoDB Atlas or use local MongoDB')
    // Don't throw error - allow app to continue without database
    // throw e
  }

  return cached.conn
}

export default dbConnect
