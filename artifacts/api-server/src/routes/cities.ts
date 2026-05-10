import { Router, type IRouter } from "express";
import { citiesTable, activityTemplatesTable } from "@workspace/db";
import { z } from "zod";

const SearchCitiesQueryParams = z.object({ q: z.string().optional() });
const ListCityActivityTemplatesParams = z.object({ cityId: z.string() });

const router: IRouter = Router();

router.get("/cities", async (req, res): Promise<void> => {
  const params = SearchCitiesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const q = params.data.q;
  
  let query = {};
  if (q) {
    const regex = new RegExp(q, 'i');
    query = { $or: [{ name: regex }, { country: regex }] };
  }

  const cities = await citiesTable.find(query)
    .sort({ popularity: -1 })
    .limit(q ? 20 : 30)
    .lean();

  res.json(
    cities.map((c) => ({
      ...c,
      costIndex: c.costIndex ? parseFloat(c.costIndex as string) : null,
      id: c._id.toString()
    })),
  );
});

router.get("/cities/:cityId/activity-templates", async (req, res): Promise<void> => {
  const params = ListCityActivityTemplatesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const templates = await activityTemplatesTable.find({ cityId: params.data.cityId }).lean();
  res.json(
    templates.map((t) => ({
      ...t,
      cost: t.cost ? parseFloat(t.cost as string) : null,
      id: t._id.toString()
    })),
  );
});

export default router;
