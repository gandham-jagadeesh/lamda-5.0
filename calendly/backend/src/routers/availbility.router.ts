import express from "express";
import * as availbilityController from "../controllers/availbilityRule.controller.js";
import { requireUserId } from "../middlewares/require.user.id.js";
import { validate } from "../middlewares/validate.js";
import { createAvailabilityRuleSchema, updateAvailabilityRuleSchema } from "../dtos/availbility.dto.js";
const router = express.Router();

router.use(requireUserId);

router.get("/", availbilityController.getRules);
router.get("/:id", availbilityController.getRule);
router.post("/",validate(createAvailabilityRuleSchema),availbilityController.createRule);
router.delete("/:id", availbilityController.removeRule);
router.put("/:id", validate(updateAvailabilityRuleSchema),availbilityController.updateRule);
