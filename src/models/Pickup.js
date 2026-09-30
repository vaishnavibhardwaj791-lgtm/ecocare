import mongoose from 'mongoose'
import { toJSONWithCode } from './plugins.js'

const PickupSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    citizen: { type: String, required: true },
    citizenEmail: { type: String, required: true, lowercase: true, index: true },
    wasteType: { type: String, required: true },
    quantity: { type: String, default: '' },
    address: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Scheduled', 'Completed'], default: 'Pending' },
  },
  { timestamps: true },
)

toJSONWithCode(PickupSchema)

export default mongoose.models.Pickup || mongoose.model('Pickup', PickupSchema)
