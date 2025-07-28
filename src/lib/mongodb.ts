import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  try {
   const connect =  await mongoose.connect(MONGODB_URI)
    console.log("MongoDB connected successfully")
    console.log(`Database Name: ${connect.connection.name}`)

  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export default connectDB
