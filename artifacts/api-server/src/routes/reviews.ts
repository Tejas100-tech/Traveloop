import { Router, type IRouter } from "express";
import { reviewsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const reviews = await reviewsTable.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  res.json(reviews.map(r => ({ 
    ...r, 
    id: r._id.toString(),
    createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString() 
  })));
});

router.post("/reviews", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { tripName, cities, rating, title, body, travelMonth, travelStyle } = req.body;
  if (!tripName || typeof tripName !== "string" || tripName.trim().length === 0) {
    res.status(400).json({ error: "tripName is required" });
    return;
  }
  if (!cities || typeof cities !== "string" || cities.trim().length === 0) {
    res.status(400).json({ error: "cities is required" });
    return;
  }
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    res.status(400).json({ error: "rating must be 1–5" });
    return;
  }
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  if (!body || typeof body !== "string" || body.trim().length < 10) {
    res.status(400).json({ error: "body must be at least 10 characters" });
    return;
  }
  const user = req.user;
  const authorName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Traveller";
  
  const review = await reviewsTable.create({
    userId: user.id,
    authorName,
    authorAvatar: user.profileImageUrl ?? null,
    tripName: tripName.trim().slice(0, 120),
    cities: cities.trim().slice(0, 200),
    rating,
    title: title.trim().slice(0, 120),
    body: body.trim().slice(0, 2000),
    travelMonth: travelMonth ?? null,
    travelStyle: travelStyle ?? null,
  });

  res.status(201).json({ 
    ...review.toObject(), 
    id: review._id.toString(),
    createdAt: review.createdAt ? review.createdAt.toISOString() : new Date().toISOString() 
  });
});

router.delete("/reviews/:reviewId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const reviewId = req.params.reviewId;
  if (!reviewId) {
    res.status(400).json({ error: "Invalid review ID" });
    return;
  }
  
  await reviewsTable.deleteOne({
    _id: reviewId,
    userId: req.user.id
  });
  
  res.sendStatus(204);
});

export default router;
