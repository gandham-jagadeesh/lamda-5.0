import express, { Router } from "express";
import * as availbilityController from "../controllers/availbilityRule.controller.js";
import { requireUserId } from "../middlewares/require.user.id.js";
import { validate } from "../middlewares/validate.js";
import { createAvailabilityRuleSchema, updateAvailabilityRuleSchema } from "../dtos/availbility.dto.js";

 export const availabilityRuleRouter:Router = express.Router();

availabilityRuleRouter.use(requireUserId);

availabilityRuleRouter.get("/", availbilityController.getRules);
availabilityRuleRouter.get("/:id", availbilityController.getRule);
availabilityRuleRouter.post("/",validate(createAvailabilityRuleSchema),availbilityController.createRule);
availabilityRuleRouter.delete("/:id", availbilityController.removeRule);
availabilityRuleRouter.put("/:id", validate(updateAvailabilityRuleSchema),availbilityController.updateRule);
