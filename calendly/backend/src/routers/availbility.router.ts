import express, { Router } from "express";
import * as availbilityController from "../controllers/availbility.controller.js";
import { requireUserId } from "../middlewares/require.user.id.js";
import { validate } from "../middlewares/validate.js";
import { createAvailabilityExceptionSchema, createAvailabilityRuleSchema, updateAvailabilityRuleSchema } from "../dtos/availbility.dto.js";

 export const availabilityRouter:Router = express.Router();
export const exceptionRouter: Router = express.Router();

availabilityRouter.use(requireUserId);


availabilityRouter.get("/", availbilityController.getRules);
availabilityRouter.get("/:id", availbilityController.getRule);
availabilityRouter.post("/",validate(createAvailabilityRuleSchema),availbilityController.createRule);
availabilityRouter.delete("/:id", availbilityController.removeRule);
availabilityRouter.put("/:id", validate(updateAvailabilityRuleSchema),availbilityController.updateRule);



exceptionRouter.use(requireUserId);

exceptionRouter.get("/", availbilityController.getAllExceptions);
exceptionRouter.get("/:id", availbilityController.findException);
exceptionRouter.post("/",validate(createAvailabilityExceptionSchema),availbilityController.createException);
exceptionRouter.delete("/:id", availbilityController.removeException);
exceptionRouter.put("/:id", validate(updateAvailabilityRuleSchema),availbilityController.updateException);
//TODO Add validation for date
exceptionRouter.get("/date", availbilityController.getExceptionByDate);
