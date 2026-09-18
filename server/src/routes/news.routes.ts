import { Router } from "express";
import {
  getPersonalizedNews,
  updateInterests,
} from "../controllers/news.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// All routes below require a valid JWT token
router.use(protect);

// PUT /api/news/interests
router.put("/interests", updateInterests);

// GET /api/news/personalized
router.get("/personalized", getPersonalizedNews);

export default router;
