import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/weather-app"
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    console.warn("Continuing without database connection...");
    // process.exit(1); // Do not crash, allow other routes (weather) to work
  }
};

export default connectDB;
