import { Router } from "express";
import {getAllUsers } from "../controllers/user.controller.js"
export const userRouter:Router =  Router();

userRouter.get("/", getAllUsers);
