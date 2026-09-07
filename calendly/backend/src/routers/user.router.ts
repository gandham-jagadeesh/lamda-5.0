import { Router } from "express";
import {getAllUsers } from "../controllers/user.controller.js"
import { createUserSchema, updateUserSchema } from "../dtos/user.dto.js";
import { validate } from "../middlewares/validate.js";
import { createUser, removeUser, getUser, updateUser } from "../controllers/user.controller.js"

export const userRouter:Router =  Router();

userRouter.get("/", getAllUsers);
userRouter.post("/", validate(createUserSchema),createUser);
userRouter.delete("/:id",removeUser);
userRouter.get("/:id", getUser);
userRouter.put("/:id", validate(updateUserSchema), updateUser);
