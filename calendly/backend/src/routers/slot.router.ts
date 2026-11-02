import { Router } from "express";
import { getAllSlots } from "../controllers/slot.controller.js"
const slotRouter = Router();

slotRouter.use();

slotRouter.get("/:host_id/:eventTypeId/", getAllSlots);
