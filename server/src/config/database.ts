import mongoose from "mongoose";

const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in the .env file");
    }

    const connection = await mongoose.connect(mongoUri);

    console.log(
      `MongoDB connected successfully: ${connection.connection.host}`,
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error instanceof Error ? error.message : error,
    );

    process.exit(1);
  }
};

export default connectDatabase;
