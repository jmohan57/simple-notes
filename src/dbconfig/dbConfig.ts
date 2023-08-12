import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("error", (err: any) =>
      console.error("MongoDB Connect Error", err)
    );
  } catch (error) {
    console.error("MongoDB Connect Error", error);
  }
}
