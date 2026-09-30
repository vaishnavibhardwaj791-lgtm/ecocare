import mongoose from 'mongoose'

// Uploaded complaint photos live in MongoDB so they survive serverless deploys
// (Vercel's filesystem is read-only and not shared between instances).
const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
)

export default mongoose.models.Image || mongoose.model('Image', ImageSchema)
