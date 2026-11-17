import { Router } from "express";
import { handleCallback  } from "../controllers/google-auth.controller.js"
export const googleRouter: Router = Router();

googleRouter.get("/",handleCallback);
