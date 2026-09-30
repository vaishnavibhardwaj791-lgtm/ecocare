import { connectDB } from '@/lib/db'
import Image from '@/models/Image'

// Serves complaint photos stored in MongoDB by saveImage().
export async function GET(_req, { params }) {
  const { name } = await params
  if (!/^[\w.-]+$/.test(name)) return new Response('Not found', { status: 404 })

  await connectDB()
  const image = await Image.findOne({ name }).lean()
  if (!image) return new Response('Not found', { status: 404 })

  return new Response(image.data.buffer ?? image.data, {
    headers: {
      'Content-Type': image.type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
