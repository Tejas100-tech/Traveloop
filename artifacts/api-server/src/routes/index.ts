import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import tripsRouter from "./trips";
import stopsRouter from "./stops";
import citiesRouter from "./cities";
import dashboardRouter from "./dashboard";
import reviewsRouter from "./reviews";
import assistantRouter from "./assistant";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(dashboardRouter);
router.use(tripsRouter);
router.use(stopsRouter);
router.use(citiesRouter);
router.use(reviewsRouter);
router.use(assistantRouter);

export default router;
