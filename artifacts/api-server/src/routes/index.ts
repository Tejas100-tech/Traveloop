import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import configRouter from "./config";
import reviewsRouter from "./reviews";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(configRouter);
router.use(authRouter);
router.use(reviewsRouter);
router.use(usersRouter);

export default router;
