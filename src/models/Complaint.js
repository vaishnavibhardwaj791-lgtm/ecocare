import mongoose from 'mongoose'
import { toJSONWithCode } from './plugins.js'

const ComplaintSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    citizen: { type: String, required: true },
    citizenEmail: { type: String, required: true, lowercase: true, index: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    landmark: { type: String, default: '' },
    date: { type: String, required: true }, // YYYY-MM-DD
    status: { type: String, default: 'Submitted' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    department: { type: String, default: '' },
    description: { type: String, required: true },
    photo: { type: String, default: '' },
  },
  { timestamps: true },
)

toJSONWithCode(ComplaintSchema)

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema)
