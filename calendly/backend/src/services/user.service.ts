import { createUserDto, UpdateUserDto } from "../dtos/user.dto.js";
import {  getAll, getById , getByEmail, create, update, remove } from "../repository/user.repository.js"
import { conflict, notFound } from "../utils/api-error.js";

// @TODO : send only speific user field : remove password field
export async function findById(id: number) {
  const user = await getById(id);
  if (!user) {
     throw notFound("user not Found");
  }
  return user;
}

export async function findAll() {
  const users = await getAll();
  return users;
}

export async function createUser(data: createUserDto) {
  const user = await getByEmail(data.email);
  if (!user) {
    throw conflict("user already exist");
  }
  const createdUser = await create(data);
  return createdUser;
}


export async function updateUser(id:number, data: UpdateUserDto) {
  const user = await getById(id);
  if (!user) {
    throw notFound("user does not exist");
  }
  if (data.email && data.email !== user.email) {
    const existingUser = await getByEmail(data.email);
    if (existingUser) {
      throw conflict("user already exists");
    }
  }
  const updatedUser = await update(id, data);
  return updatedUser;
}

export async function removeUser(id: number) {
  const user = await findById(id);
  if (!user) {
    throw notFound("user not Found");
  }
  const removedUser = await remove(id);
  return removedUser;
}
