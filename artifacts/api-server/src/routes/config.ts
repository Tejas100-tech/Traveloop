import { Router, type IRouter } from "express";

const router: IRouter = Router();

/**
 * Public runtime configuration for the browser bundle.
 *
 * Only browser-safe values belong here — never API secrets. The Google Maps
 * key is a client key (restrict it by HTTP referrer in Google Cloud), and
 * serving it at runtime means it can be rotated without a frontend rebuild.
 */
router.get("/config", (_req, res): void => {
  res.json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? null,
  });
});

export default router;
