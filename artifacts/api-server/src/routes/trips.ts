import { Router, type IRouter } from "express";
import { tripsTable, stopsTable, activitiesTable, packingItemsTable, notesTable } from "@workspace/db";
import {
  CreateTripBody,
  UpdateTripBody,
  GetTripParams,
  UpdateTripParams,
  DeleteTripParams,
  GetSharedTripParams,
  GetTripBudgetParams,
  ListPackingItemsParams,
  CreatePackingItemBody,
  CreatePackingItemParams,
  UpdatePackingItemParams,
  UpdatePackingItemBody,
  DeletePackingItemParams,
  ListNotesParams,
  CreateNoteParams,
  CreateNoteBody,
  UpdateNoteParams,
  UpdateNoteBody,
  DeleteNoteParams,
} from "@workspace/api-zod";
import { nanoid } from "./nanoid";

const router: IRouter = Router();

function formatTrip(trip: any, stopCount?: number) {
  return {
    id: trip._id.toString(),
    userId: trip.userId,
    name: trip.name,
    description: trip.description ?? null,
    coverPhoto: trip.coverPhoto ?? null,
    startDate: trip.startDate,
    endDate: trip.endDate,
    isPublic: trip.isPublic,
    shareSlug: trip.shareSlug,
    totalBudget: trip.totalBudget ? parseFloat(trip.totalBudget) : null,
    stopCount: stopCount ?? null,
    createdAt: trip.createdAt ? trip.createdAt.toISOString() : new Date().toISOString(),
  };
}

router.get("/trips", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const trips = await tripsTable.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const tripsWithCounts = await Promise.all(
    trips.map(async (trip) => {
      const count = await stopsTable.countDocuments({ tripId: trip._id });
      return formatTrip(trip, count);
    }),
  );

  res.json(tripsWithCounts);
});

router.post("/trips", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = CreateTripBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { totalBudget, ...rest } = parsed.data;
  const trip = await tripsTable.create({
    ...rest,
    userId: req.user.id,
    shareSlug: nanoid(10),
    totalBudget: totalBudget != null ? String(totalBudget) : undefined,
  });
  
  res.status(201).json(formatTrip(trip.toObject(), 0));
});

router.get("/trips/shared/:shareSlug", async (req, res): Promise<void> => {
  const params = GetSharedTripParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const trip = await tripsTable.findOne({ shareSlug: params.data.shareSlug, isPublic: true }).lean();
  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }
  const stops = await stopsTable.find({ tripId: trip._id }).sort({ orderIndex: 1 }).lean();
  
  const stopsWithActivities = await Promise.all(
    stops.map(async (stop) => {
      const activities = await activitiesTable.find({ stopId: stop._id }).sort({ createdAt: 1 }).lean();
      return {
        ...stop,
        id: stop._id.toString(),
        startDate: stop.startDate,
        endDate: stop.endDate,
        createdAt: stop.createdAt ? stop.createdAt.toISOString() : new Date().toISOString(),
        activities: activities.map((a) => ({
          ...a,
          id: a._id.toString(),
          cost: a.cost ? parseFloat(a.cost as string) : null,
          createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString(),
        })),
      };
    }),
  );
  res.json({ ...formatTrip(trip), stops: stopsWithActivities });
});

router.get("/trips/:tripId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = GetTripParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const trip = await tripsTable.findOne({ _id: params.data.tripId, userId: req.user.id }).lean();
  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }
  const stops = await stopsTable.find({ tripId: trip._id }).sort({ orderIndex: 1 }).lean();
  const stopsWithActivities = await Promise.all(
    stops.map(async (stop) => {
      const activities = await activitiesTable.find({ stopId: stop._id }).sort({ createdAt: 1 }).lean();
      return {
        ...stop,
        id: stop._id.toString(),
        startDate: stop.startDate,
        endDate: stop.endDate,
        createdAt: stop.createdAt ? stop.createdAt.toISOString() : new Date().toISOString(),
        activities: activities.map((a) => ({
          ...a,
          id: a._id.toString(),
          cost: a.cost ? parseFloat(a.cost as string) : null,
          createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString(),
        })),
      };
    }),
  );
  res.json({ ...formatTrip(trip), stops: stopsWithActivities });
});

router.patch("/trips/:tripId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = UpdateTripParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTripBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { totalBudget, ...rest } = parsed.data;
  
  const trip = await tripsTable.findOneAndUpdate(
    { _id: params.data.tripId, userId: req.user.id },
    { $set: { ...rest, ...(totalBudget !== undefined ? { totalBudget: String(totalBudget) } : {}) } },
    { new: true }
  ).lean();
  
  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }
  res.json(formatTrip(trip));
});

router.delete("/trips/:tripId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = DeleteTripParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await tripsTable.deleteOne({ _id: params.data.tripId, userId: req.user.id });
  res.sendStatus(204);
});

// Budget
router.get("/trips/:tripId/budget", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = GetTripBudgetParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const trip = await tripsTable.findOne({ _id: params.data.tripId, userId: req.user.id }).lean();
  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }
  const stops = await stopsTable.find({ tripId: trip._id }).lean();

  const categoryMap: Record<string, number> = {};
  const breakdown = await Promise.all(
    stops.map(async (stop) => {
      const activities = await activitiesTable.find({ stopId: stop._id }).lean();
      let cost = 0;
      for (const a of activities) {
        const c = a.cost ? parseFloat(a.cost as string) : 0;
        cost += c;
        const cat = (a.type || "other").toLowerCase();
        categoryMap[cat] = (categoryMap[cat] ?? 0) + c;
      }
      return { stopId: stop._id.toString(), cityName: stop.cityName, cost };
    }),
  );

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, cost]) => ({ category, cost }))
    .sort((a, b) => b.cost - a.cost);

  const activitiesCost = breakdown.reduce((sum, b) => sum + b.cost, 0);

  const startMs = new Date(trip.startDate).getTime();
  const endMs = new Date(trip.endDate).getTime();
  const tripDays = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);
  const avgCostPerDay = tripDays > 0 ? activitiesCost / tripDays : 0;

  res.json({
    tripId: trip._id.toString(),
    totalEstimated: activitiesCost,
    totalBudget: trip.totalBudget ? parseFloat(trip.totalBudget as string) : null,
    activitiesCost,
    avgCostPerDay,
    tripDays,
    breakdown,
    categoryBreakdown,
  });
});

// Packing
router.get("/trips/:tripId/packing", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = ListPackingItemsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const items = await packingItemsTable.find({ tripId: params.data.tripId }).sort({ createdAt: 1 }).lean();
  res.json(
    items.map((i) => ({ ...i, id: i._id.toString(), createdAt: i.createdAt ? i.createdAt.toISOString() : new Date().toISOString() })),
  );
});

router.post("/trips/:tripId/packing", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = CreatePackingItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = CreatePackingItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const item = await packingItemsTable.create({ ...parsed.data, tripId: params.data.tripId });
  res.status(201).json({ ...item.toObject(), id: item._id.toString(), createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString() });
});

router.patch("/trips/:tripId/packing/:itemId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = UpdatePackingItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePackingItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const item = await packingItemsTable.findOneAndUpdate(
    { _id: params.data.itemId, tripId: params.data.tripId },
    { $set: parsed.data },
    { new: true }
  ).lean();
  
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  res.json({ ...item, id: item._id.toString(), createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString() });
});

router.delete("/trips/:tripId/packing/:itemId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = DeletePackingItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await packingItemsTable.deleteOne({ _id: params.data.itemId, tripId: params.data.tripId });
  res.sendStatus(204);
});

// Notes
router.get("/trips/:tripId/notes", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = ListNotesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const notes = await notesTable.find({ tripId: params.data.tripId }).sort({ createdAt: -1 }).lean();
  res.json(
    notes.map((n) => ({ 
      ...n, 
      id: n._id.toString(),
      createdAt: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString(), 
      updatedAt: n.updatedAt ? n.updatedAt.toISOString() : new Date().toISOString() 
    })),
  );
});

router.post("/trips/:tripId/notes", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = CreateNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = CreateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const note = await notesTable.create({ ...parsed.data, tripId: params.data.tripId });
  res.status(201).json({ 
    ...note.toObject(), 
    id: note._id.toString(),
    createdAt: note.createdAt ? note.createdAt.toISOString() : new Date().toISOString(), 
    updatedAt: note.updatedAt ? note.updatedAt.toISOString() : new Date().toISOString() 
  });
});

router.patch("/trips/:tripId/notes/:noteId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = UpdateNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateNoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const note = await notesTable.findOneAndUpdate(
    { _id: params.data.noteId, tripId: params.data.tripId },
    { $set: parsed.data },
    { new: true }
  ).lean();
  
  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }
  res.json({ 
    ...note, 
    id: note._id.toString(),
    createdAt: note.createdAt ? note.createdAt.toISOString() : new Date().toISOString(), 
    updatedAt: note.updatedAt ? note.updatedAt.toISOString() : new Date().toISOString() 
  });
});

router.delete("/trips/:tripId/notes/:noteId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const params = DeleteNoteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await notesTable.deleteOne({ _id: params.data.noteId, tripId: params.data.tripId });
  res.sendStatus(204);
});

export default router;
