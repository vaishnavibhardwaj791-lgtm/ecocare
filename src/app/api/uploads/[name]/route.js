import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { EXT_TO_TYPE, UPLOAD_DIR } from '@/lib/uploads'

// Serves images saved by the back end into the /uploads folder.
export async function GET(_req, { params }) {
  const { name } = await params
  // Only allow plain file names — no directory traversal.
  if (!/^[\w.-]+$/.test(name) || name.startsWith('.')) {
    return new Response('Not found', { status: 404 })
  }
  const type = EXT_TO_TYPE[path.extname(name).toLowerCase()]
  if (!type) return new Response('Not found', { status: 404 })

  try {
    const data = await readFile(path.join(UPLOAD_DIR, name))
    return new Response(data, {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
