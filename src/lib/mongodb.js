import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
	if (cached.conn) {
		console.log("✅ [MONGODB] Using cached connection");
		return cached.conn;
	}

	if (!cached.promise) {
		console.log("🔄 [MONGODB] Creating new connection...");
		
		// Configure mongoose with better timeout and retry settings
		const options = {
			maxPoolSize: 10, // Maintain up to 10 socket connections
			serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
			socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
			connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
			heartbeatFrequencyMS: 10000, // Check connection health every 10 seconds
		};

		cached.promise = mongoose.connect(MONGODB_URI, options)
			.then((mongoose) => {
				console.log("✅ [MONGODB] Successfully connected to MongoDB");
				return mongoose;
			})
			.catch((error) => {
				console.error("❌ [MONGODB] Connection failed:", error.message);
				// Clear the promise so we can retry
				cached.promise = null;
				throw error;
			});
	}

	try {
		cached.conn = await cached.promise;
		return cached.conn;
	} catch (error) {
		console.error("❌ [MONGODB] Failed to establish connection:", error.message);
		// Clear the promise and connection on error
		cached.promise = null;
		cached.conn = null;
		throw error;
	}
}

// Alias for compatibility
export const connectDB = dbConnect;

// Graceful shutdown function
export async function dbDisconnect() {
	if (cached.conn) {
		await mongoose.disconnect();
		cached.conn = null;
		cached.promise = null;
		console.log("🔌 [MONGODB] Disconnected from MongoDB");
	}
}
