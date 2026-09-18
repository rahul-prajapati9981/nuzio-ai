import { Request, Response } from "express";
import User from "../models/User";
import { newsArticles } from "../data/news";

const allowedInterests = [
  "Technology",
  "Finance",
  "Startups",
  "Health",
  "Science",
  "Sports",
];

// Save the user's selected interests
export const updateInterests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { interests } = req.body;

    if (!Array.isArray(interests) || interests.length === 0) {
      res.status(400).json({
        success: false,
        message: "Select at least one interest",
      });
      return;
    }

    const validInterests = interests.filter(
      (interest): interest is string =>
        typeof interest === "string" && allowedInterests.includes(interest),
    );

    if (validInterests.length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid interests were selected",
      });
      return;
    }

    const uniqueInterests = [...new Set(validInterests)];

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        interests: uniqueInterests,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Interests saved successfully",
      interests: user.interests,
    });
  } catch (error) {
    console.error("Update interests error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save interests",
    });
  }
};

// Return news based on the user's interests
export const getPersonalizedNews = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const personalizedNews =
      user.interests.length > 0
        ? newsArticles.filter((article) =>
            user.interests.includes(article.category),
          )
        : newsArticles;

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        interests: user.interests,
      },
      count: personalizedNews.length,
      articles: personalizedNews,
    });
  } catch (error) {
    console.error("Get news error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load personalized news",
    });
  }
};
