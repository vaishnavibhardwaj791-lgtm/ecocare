import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // bcrypt hash — the plain password is never stored.
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
    area: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { timestamps: true },
)

UserSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id)
    delete ret._id
    delete ret.password
    return ret
  },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
