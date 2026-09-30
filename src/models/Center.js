import mongoose from 'mongoose'
import { toJSONWithCode } from './plugins.js'

const CenterSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    types: { type: [String], default: [] },
    address: { type: String, required: true },
    distance: { type: String, default: '—' },
    phone: { type: String, default: '' },
    hours: { type: String, default: '' },
    // Position on the stylised map preview, in percent.
    x: { type: Number, default: 50 },
    y: { type: Number, default: 50 },
  },
  { timestamps: true },
)

toJSONWithCode(CenterSchema)

export default mongoose.models.Center || mongoose.model('Center', CenterSchema)
