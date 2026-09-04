import { Response } from "express";

interface successPayLoad<T>{
  success: boolean,
  data: T,
  message?:string
}

export function successResponse<T>(res: Response, data: T, statusCode: number = 200, message?: string) {
  const payload: successPayLoad<T> = {
    success: true,
    data,
  }
  if (message) payload.message = message;
  return res.status(statusCode).json(payload.data);
}
