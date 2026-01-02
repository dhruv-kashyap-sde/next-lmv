import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("mongodb connected successfully");
      
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("mongodb connected successfully");  
  } catch (e) {
    cached.promise = null;
    console.log("mongodb connection failed");
    
    throw e;
  }

  return cached.conn;
}

export default connectDB;
