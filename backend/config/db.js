import mongoose from "mongoose";

let isConnected = false;

async function connectToDB() {
  if (isConnected) {
    return;
  }
  await mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      isConnected = true;
      console.log("✅ Successfully connected to MongoDB");
    })
    .catch((error) => {
      console.log("❌ Error connecting to MongoDB:", error);
      process.exit(1);
    });
}

export default connectToDB;
