import mongoose from 'mongoose'
import { MONGODB_URI } from './config'

// Reuse one connection across hot reloads and route handler invocations.
const cached = globalThis._mongoose || (globalThis._mongoose = { conn: null, promise: null })

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).catch((err) => {
      cached.promise = null
      throw err
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
