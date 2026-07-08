import mongoose from 'mongoose'

let connected = false

export function isConnected() {
  return connected
}

// Connect to MongoDB Atlas. If MONGO_URI is unset or the connection fails, the server keeps
// running without persistence so the frontend still works during development.
export async function connectDB() {
  const uri = process.env.MONGO_URI
  if (!uri || uri.includes('<user>')) {
    console.warn(
      '\n⚠️  MONGO_URI not set — running WITHOUT a database.\n' +
        '   Copy server/.env.example to server/.env and add your MongoDB Atlas string\n' +
        '   to enable progress/notes persistence.\n',
    )
    return
  }
  try {
    await mongoose.connect(uri)
    connected = true
    console.log('✅ Connected to MongoDB')
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    console.error('   Server will run without persistence.')
  }
}
