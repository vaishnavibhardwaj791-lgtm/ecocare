import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

export const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export const IMAGE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

export const EXT_TO_TYPE = Object.fromEntries(Object.entries(IMAGE_TYPES).map(([type, ext]) => [ext, type]))
EXT_TO_TYPE['.jpeg'] = 'image/jpeg'

/** Saves an uploaded image File to /uploads and returns its public URL. */
export async function saveImage(file) {
  const ext = IMAGE_TYPES[file.type]
  if (!ext) throw new Error('Only JPG, PNG, WEBP or GIF images are allowed')
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Image must be 5 MB or smaller')

  await mkdir(UPLOAD_DIR, { recursive: true })
  const name = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()))
  return `/api/uploads/${name}`
}
