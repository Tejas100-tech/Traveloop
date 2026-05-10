import { Router, type IRouter } from "express";
import { tripsTable, stopsTable, activitiesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard", async (req, res): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0]!;

  const totalTrips = await tripsTable.countDocuments({ userId });
  
  const allTrips = await tripsTable.find({ userId }).select('_id').lean();
  const tripIds = allTrips.map(t => t._id);

  const allStops = await stopsTable.find({ tripId: { $in: tripIds } }).select('cityName').lean();
  const uniqueCities = new Set(allStops.map((s) => s.cityName)).size;

  const stopIds = await stopsTable.find({ tripId: { $in: tripIds } }).select('_id').lean();
  const totalActivities = await activitiesTable.countDocuments({ stopId: { $in: stopIds.map(s => s._id) } });

  const recentTrips = await tripsTable.find({ userId })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const recentTripsFormatted = await Promise.all(
    recentTrips.map(async (trip) => {
      const stopCount = await stopsTable.countDocuments({ tripId: trip._id });
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
        totalBudget: trip.totalBudget ? parseFloat(trip.totalBudget as string) : null,
        stopCount: stopCount,
        createdAt: trip.createdAt ? trip.createdAt.toISOString() : new Date().toISOString(),
      };
    }),
  );

  res.json({
    totalTrips: totalTrips,
    upcomingTrips: recentTrips.filter((t) => t.endDate >= today).length,
    totalCitiesVisited: uniqueCities,
    totalActivities: totalActivities,
    recentTrips: recentTripsFormatted,
  });
});

export default router;
