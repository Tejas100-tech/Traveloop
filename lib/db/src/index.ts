import mongoose from "mongoose";
import { z } from "zod";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoUri = process.env.MONGO_URI;

async function initDB() {
  if (!mongoUri) {
    console.log("MONGO_URI not found. Starting mongodb-memory-server...");
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
  }
  await mongoose.connect(mongoUri);
  console.log(`Connected to MongoDB at ${mongoUri}`);
}
initDB().catch(console.error);

const { Schema, model } = mongoose;

// Users
export const userSchema = new Schema(
  {
    email: { type: String, unique: true },
    password: { type: String },
    firstName: String,
    lastName: String,
    profileImageUrl: String,
  },
  { timestamps: true },
);
export const UserModel = model("User", userSchema);

export const insertUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof UserModel.prototype;

// Sessions
export const sessionSchema = new Schema({
  sid: { type: String, required: true, unique: true },
  sess: { type: Schema.Types.Mixed, required: true },
  expire: { type: Date, required: true },
});
export const SessionModel = model("Session", sessionSchema);

// Reviews — travellers rating destinations, homestays and guides
export const reviewSchema = new Schema(
  {
    userId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorAvatar: String,
    tripName: { type: String, required: true },
    cities: { type: String, required: true },
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    travelMonth: String,
    travelStyle: String,
    category: { type: String, default: "Destination" },
  },
  { timestamps: true },
);
export const ReviewModel = model("Review", reviewSchema);

export const insertReviewSchema = z.object({
  userId: z.string(),
  authorName: z.string(),
  authorAvatar: z.string().optional().nullable(),
  tripName: z.string(),
  cities: z.string(),
  rating: z.number(),
  title: z.string(),
  body: z.string(),
  travelMonth: z.string().optional().nullable(),
  travelStyle: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof ReviewModel.prototype;

export const db = mongoose;
export const usersTable = UserModel;
export const sessionsTable = SessionModel;
export const reviewsTable = ReviewModel;
