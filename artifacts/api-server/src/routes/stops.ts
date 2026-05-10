import { Router, type IRouter } from "express";
import { stopsTable, activitiesTable, tripsTable } from "@workspace/db";

const router: IRouter = Router();

function formatStop(stop: any) {
  return {
    ...stop,
    id: stop._id.toString(),
    startDate: stop.startDate,
    endDate: stop.endDate,
    createdAt: stop.createdAt ? stop.createdAt.toISOString() : new Date().toISOString(),
  };
}

function formatActivity(a: any) {
  return {
    ...a,
    id: a._id.toString(),
    cost: a.cost ? parseFloat(a.cost as string) : null,
    createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString(),
  };
}

router.get("/trips/:tripId/stops", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const tripId = req.params.tripId;
  const stops = await stopsTable.find({ tripId }).sort({ orderIndex: 1 }).lean();
  res.json(stops.map(formatStop));
});

router.post("/trips/:tripId/stops", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const tripId = req.params.tripId;
  
  const trip = await tripsTable.findOne({ _id: tripId, userId: req.user.id });
  if (!trip) {
    res.status(404).json({ error: "Trip not found" });
    return;
  }
  
  const stop = await stopsTable.create({ ...req.body, tripId });
  res.status(201).json(formatStop(stop.toObject()));
});

router.patch("/trips/:tripId/stops/:stopId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { tripId, stopId } = req.params;
  
  const stop = await stopsTable.findOneAndUpdate(
    { _id: stopId, tripId },
    { $set: req.body },
    { new: true }
  ).lean();
  
  if (!stop) {
    res.status(404).json({ error: "Stop not found" });
    return;
  }
  res.json(formatStop(stop));
});

router.delete("/trips/:tripId/stops/:stopId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { tripId, stopId } = req.params;
  await stopsTable.deleteOne({ _id: stopId, tripId });
  res.sendStatus(204);
});

// Activities
router.get("/stops/:stopId/activities", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const stopId = req.params.stopId;
  const activities = await activitiesTable.find({ stopId }).sort({ createdAt: 1 }).lean();
  res.json(activities.map(formatActivity));
});

router.post("/stops/:stopId/activities", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const stopId = req.params.stopId;
  const { cost, ...rest } = req.body;
  
  const activity = await activitiesTable.create({ 
    ...rest, 
    cost: cost != null ? String(cost) : undefined, 
    stopId 
  });
  
  res.status(201).json(formatActivity(activity.toObject()));
});

router.patch("/stops/:stopId/activities/:activityId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { stopId, activityId } = req.params;
  const { cost, ...rest } = req.body;
  
  const activity = await activitiesTable.findOneAndUpdate(
    { _id: activityId, stopId },
    { $set: { ...rest, ...(cost !== undefined ? { cost: String(cost) } : {}) } },
    { new: true }
  ).lean();
  
  if (!activity) {
    res.status(404).json({ error: "Activity not found" });
    return;
  }
  res.json(formatActivity(activity));
});

router.delete("/stops/:stopId/activities/:activityId", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { stopId, activityId } = req.params;
  await activitiesTable.deleteOne({ _id: activityId, stopId });
  res.sendStatus(204);
});

export default router;
