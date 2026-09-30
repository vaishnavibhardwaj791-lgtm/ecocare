import { randomBytes } from 'node:crypto'
import Image from '@/models/Image'

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export const IMAGE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

/** Saves an uploaded image File to MongoDB and returns its public URL. Caller must have connected. */
export async function saveImage(file) {
  const ext = IMAGE_TYPES[file.type]
  if (!ext) throw new Error('Only JPG, PNG, WEBP or GIF images are allowed')
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Image must be 5 MB or smaller')

  const name = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`
  await Image.create({ name, type: file.type, data: Buffer.from(await file.arrayBuffer()) })
  return `/api/uploads/${name}`
}
