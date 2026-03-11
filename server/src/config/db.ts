import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URL as string);
    const conn = await mongoose.connect(process.env.MONGODB_URL as string);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(error.message);
  }
};

export default connectDB;
