import { Request, Response } from "express";
import { successResponse } from "../utils/api-success-response.js";
import { getAuthToken } from "../services/googleCalender.service.js";


export async function handleCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  console.log("code : ", code);
  const userId = req.userId;
  const state = req.query.state as string;
  const error = req.query?.error as string  || undefined;
  console.log("state : ", state);
  const authTokens = await getAuthToken(userId,code,state,error);
  successResponse(res, authTokens , 200, "sucessfully gotten access");
}
