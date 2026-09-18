import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./config/database";
import authRoutes from "./routes/auth.routes";
import newsRoutes from "./routes/news.routes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

// Connect to MongoDB Atlas
connectDatabase();

// Allow requests from local and deployed frontends
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parse incoming JSON request bodies
app.use(express.json());

// Health-check endpoint
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Nuzio AI API is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Personalized news routes
app.use("/api/news", newsRoutes);

// Handle unknown API endpoints
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Handle unexpected server errors
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Nuzio AI server is running on port ${port}`);
});
