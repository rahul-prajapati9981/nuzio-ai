import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./config/database";
import authRoutes from "./routes/auth.routes";
import newsRoutes from "./routes/news.routes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  (origin): origin is string => Boolean(origin),
);

// Connect to MongoDB
connectDatabase();

// Allow local, production and Vercel preview requests
app.use(
  cors({
    origin: (origin, callback) => {
      const isAllowed =
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);

// Read JSON request bodies
app.use(express.json());

// Health-check endpoint
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Nuzio AI API is running",
  });
});

// Application routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

// Handle unknown endpoints
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Handle unexpected errors
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
