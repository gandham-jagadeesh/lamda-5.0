import { Request, Response } from "express";
import { successResponse } from "../utils/api-success-response.js";
import { getAuthToken } from "../services/googleCalender.service.js";


export async function handleCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  console.log("code : ", code);
  const state = req.query.state;
  console.log("state : ", state);
  const authTokens = await getAuthToken(code);
  successResponse(res, authTokens , 200, "sucessfully gotten access");
}
