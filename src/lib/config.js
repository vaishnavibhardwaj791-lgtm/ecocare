// Hardcoded fallbacks so the app runs even where no env vars are set (e.g. Vercel).
// Environment variables still take precedence when present.
export const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://vaishnavibhardwaj791_db_user:ap6ZpGCha7CccY8Z@ac-gqbue4y-shard-00-00.s0k7osq.mongodb.net:27017,ac-gqbue4y-shard-00-01.s0k7osq.mongodb.net:27017,ac-gqbue4y-shard-00-02.s0k7osq.mongodb.net:27017/ecowaste?ssl=true&authSource=admin&replicaSet=atlas-3pszdv-shard-0&retryWrites=true&w=majority&appName=Cluster0'

export const JWT_SECRET = process.env.JWT_SECRET || 'ecowaste-dev-secret-9f3c2a7e5b1d4c8a6e0f2b9d7c3a1e5f'
