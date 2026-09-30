import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema(
  {
    // Either sent to every admin (audience: 'admin') or to one citizen (userEmail).
    audience: { type: String, enum: ['admin', 'user'], required: true },
    userEmail: { type: String, lowercase: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    unread: { type: Boolean, default: true },
  },
  { timestamps: true },
)

NotificationSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id)
    delete ret._id
    return ret
  },
})

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema)

export function notifyAdmins(title, body) {
  return Notification.create({ audience: 'admin', title, body })
}

export function notifyUser(userEmail, title, body) {
  return Notification.create({ audience: 'user', userEmail, title, body })
}

export default Notification
