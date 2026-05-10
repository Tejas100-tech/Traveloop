import mongoose from "mongoose";
import { z } from "zod";
import { MongoMemoryServer } from 'mongodb-memory-server';

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
export const userSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  firstName: String,
  lastName: String,
  profileImageUrl: String,
}, { timestamps: true });
export const UserModel = model('User', userSchema);

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
export const SessionModel = model('Session', sessionSchema);

// Trips
export const tripSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  coverPhoto: String,
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
  shareSlug: { type: String, required: true, unique: true },
  totalBudget: String,
}, { timestamps: true });
export const TripModel = model('Trip', tripSchema);

export const insertTripSchema = z.object({
  userId: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  coverPhoto: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  isPublic: z.boolean().optional(),
  shareSlug: z.string().optional(),
  totalBudget: z.string().optional().nullable(),
});
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof TripModel.prototype;

// Stops
export const stopSchema = new Schema({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  cityName: { type: String, required: true },
  country: { type: String, required: true },
  region: String,
  orderIndex: { type: Number, default: 0 },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  notes: String,
}, { timestamps: true });
export const StopModel = model('Stop', stopSchema);

export const insertStopSchema = z.object({
  tripId: z.any(),
  cityName: z.string(),
  country: z.string(),
  region: z.string().optional().nullable(),
  orderIndex: z.number().optional(),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().optional().nullable(),
});
export type InsertStop = z.infer<typeof insertStopSchema>;
export type Stop = typeof StopModel.prototype;

// Activities
export const activitySchema = new Schema({
  stopId: { type: Schema.Types.ObjectId, ref: 'Stop', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: String,
  cost: String,
  duration: Number,
}, { timestamps: true });
export const ActivityModel = model('Activity', activitySchema);

export const insertActivitySchema = z.object({
  stopId: z.any(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional().nullable(),
  cost: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
});
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof ActivityModel.prototype;

// Cities
export const citySchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  region: String,
  description: String,
  costIndex: String,
  imageUrl: String,
  popularity: { type: Number, default: 0 },
});
export const CityModel = model('City', citySchema);

export const insertCitySchema = z.object({
  name: z.string(),
  country: z.string(),
  region: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  costIndex: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  popularity: z.number().optional(),
});
export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof CityModel.prototype;

// Activity Templates
export const activityTemplateSchema = new Schema({
  cityId: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: String,
  cost: String,
  duration: Number,
  imageUrl: String,
});
export const ActivityTemplateModel = model('ActivityTemplate', activityTemplateSchema);

export const insertActivityTemplateSchema = z.object({
  cityId: z.any(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional().nullable(),
  cost: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});
export type InsertActivityTemplate = z.infer<typeof insertActivityTemplateSchema>;
export type ActivityTemplate = typeof ActivityTemplateModel.prototype;

// Packing Items
export const packingItemSchema = new Schema({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'general' },
  isPacked: { type: Boolean, default: false },
}, { timestamps: true });
export const PackingItemModel = model('PackingItem', packingItemSchema);

export const insertPackingItemSchema = z.object({
  tripId: z.any(),
  name: z.string(),
  category: z.string().optional(),
  isPacked: z.boolean().optional(),
});
export type InsertPackingItem = z.infer<typeof insertPackingItemSchema>;
export type PackingItem = typeof PackingItemModel.prototype;

// Notes
export const noteSchema = new Schema({
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  stopId: { type: Schema.Types.ObjectId, ref: 'Stop' },
  content: { type: String, required: true },
}, { timestamps: true });
export const NoteModel = model('Note', noteSchema);

export const insertNoteSchema = z.object({
  tripId: z.any(),
  stopId: z.any().optional().nullable(),
  content: z.string(),
});
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof NoteModel.prototype;

// Reviews
export const reviewSchema = new Schema({
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
}, { timestamps: true });
export const ReviewModel = model('Review', reviewSchema);

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
});
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof ReviewModel.prototype;

// Export all models so it mimics drizzle tables export names partially, but routes will be updated
export const db = mongoose;
export const usersTable = UserModel;
export const sessionsTable = SessionModel;
export const tripsTable = TripModel;
export const stopsTable = StopModel;
export const activitiesTable = ActivityModel;
export const citiesTable = CityModel;
export const activityTemplatesTable = ActivityTemplateModel;
export const packingItemsTable = PackingItemModel;
export const notesTable = NoteModel;
export const reviewsTable = ReviewModel;
