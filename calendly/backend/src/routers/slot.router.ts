import { Router } from "express";
import { getAllSlots } from "../controllers/slot.controller.js"
import { requireUserId } from "../middlewares/require.user.id.js";

const slotRouter: Router = Router();

slotRouter.use(requireUserId);

slotRouter.get("/:host_id/:eventTypeId", getAllSlots);

export { slotRouter };
