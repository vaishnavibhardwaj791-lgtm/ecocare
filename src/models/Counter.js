import mongoose from 'mongoose'

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
})

const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema)

// Atomically generates ids like CMP-1049, PKP-221, CTR-06.
export async function nextCode(prefix, { start = 1000, pad = 4 } = {}) {
  await Counter.updateOne({ _id: prefix }, { $setOnInsert: { seq: start } }, { upsert: true })
  const doc = await Counter.findOneAndUpdate({ _id: prefix }, { $inc: { seq: 1 } }, { returnDocument: 'after' })
  return `${prefix}-${String(doc.seq).padStart(pad, '0')}`
}

export default Counter
