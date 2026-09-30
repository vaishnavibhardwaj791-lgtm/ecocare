import mongoose from 'mongoose'

// Reuse one connection across hot reloads and route handler invocations.
const cached = globalThis._mongoose || (globalThis._mongoose = { conn: null, promise: null })

export async function connectDB() {
  if (cached.conn) return cached.conn
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set. Add it to .env.local')
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false }).catch((err) => {
      cached.promise = null
      throw err
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
