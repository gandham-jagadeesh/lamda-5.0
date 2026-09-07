import { Request , Response , NextFunction } from "express"
import { findAll as findAllByService, findById as findByIdByService, removeUser as removeUserByService , updateUser as updateUserByService } from "../services/user.service.js"
import { successResponse } from "../utils/api-success-response.js";
import { create } from "../repository/user.repository.js";

export  async function  getAllUsers(_req: Request, res: Response, _next: NextFunction){
  const users = await findAllByService();
  successResponse(res, users);
}

interface userParam{
  id:string
}

export async function getUser(req: Request<userParam>, res: Response, _next: NextFunction) {
  const { id } = req.params;
  const user_id = Number.parseInt(id);
  const user = await findByIdByService(user_id);
  successResponse(res, user);
}

export async function createUser(req: Request , res: Response, _next: NextFunction) {
  const user = req.body;
  console.log("[user] log : ",user);
  const createdUser = await create(user);
  successResponse(res, createdUser,201,"user created sucessfully");
}

export async function removeUser(req: Request<{id:string}>, res: Response, _next: NextFunction) {
  const { id } = req.params;
  const user_id = Number.parseInt(id);
  const removedUser = await removeUserByService(user_id);
  successResponse(res, removedUser,200,"user removed sucessfully");
}



export async function updateUser(req: Request<{id:string}> , res: Response, _next: NextFunction) {
  const { id } = req.params;
  const user_id = Number.parseInt(id);
  const user = req.body;
  const updatedUser = await updateUserByService(user_id,user);
  successResponse(res, updatedUser,200,"user updated sucessfully");
}
