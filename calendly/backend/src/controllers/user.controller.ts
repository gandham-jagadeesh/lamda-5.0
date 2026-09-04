import { Request , Response , NextFunction } from "express"
import { findAll as findAllByService } from "../services/user.service.js"
import { successResponse } from "../utils/api-success-response.js";

export  async function  getAllUsers(req: Request, res: Response, next: NextFunction){
  const users = await findAllByService();
  successResponse(res, users);
}
