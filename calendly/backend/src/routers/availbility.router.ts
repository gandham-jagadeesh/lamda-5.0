import express, { Router } from "express";
import * as availbilityController from "../controllers/availbility.controller.js";
import { requireUserId } from "../middlewares/require.user.id.js";
import { validate } from "../middlewares/validate.js";
import { createAvailabilityExceptionValidationSchema , updateAvailabilityExceptionValidationSchema , createAvailabilityRuleValidationSchema , updateAvailabilityRuleValidationSchema} from "../dtos/availbility.dto.js";

 export const availabilityRouter:Router = express.Router();
export const exceptionRouter: Router = express.Router();

availabilityRouter.use(requireUserId);


availabilityRouter.get("/", availbilityController.getRules);
availabilityRouter.get("/:id", availbilityController.getRule);
availabilityRouter.post("/",validate(createAvailabilityRuleValidationSchema),availbilityController.createRule);
availabilityRouter.delete("/:id", availbilityController.removeRule);
availabilityRouter.put("/:id", validate(updateAvailabilityRuleValidationSchema),availbilityController.updateRule);



exceptionRouter.use(requireUserId);

exceptionRouter.get("/", availbilityController.getAllExceptions);
exceptionRouter.get("/:id", availbilityController.findException);
exceptionRouter.post("/",validate(createAvailabilityExceptionValidationSchema),availbilityController.createException);
exceptionRouter.delete("/:id", availbilityController.removeException);
exceptionRouter.put("/:id", validate(updateAvailabilityExceptionValidationSchema),availbilityController.updateException);
//TODO Add validation for date
exceptionRouter.get("/date", availbilityController.getExceptionByDate);
