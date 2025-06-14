import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectToDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

// connect to database
connectToDB();

const app = express();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// middleware for parsing json
app.use(express.json());

// middleware for handling cors
app.use(cors(corsOptions));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// serve static files
app.use("/uploads", express.static("uploads"));

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
