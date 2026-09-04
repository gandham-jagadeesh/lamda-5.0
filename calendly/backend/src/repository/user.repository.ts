import { prisma }  from "../config/database.js";
import { UpdateUserDto, createUserDto } from "../dtos/user.dto.js";

export async function getById(id: number) {
  const user = await prisma.user.findFirst({
    where: {
      id
    }
  });
  return user;
}

export async function getByEmail(email:string) {
  const user = await prisma.user.findFirst({
    where: {
      email
    }
  });
  return user;
}

export async function getAll() {
  const users = await prisma.user.findMany();
  return users;
}

export async function create(user: createUserDto) {
  const createdUser = await prisma.user.create({
    data: user
  });
  return createdUser;
}


export async function update(id: number, user: UpdateUserDto) {
  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: user
  });
  return updatedUser;
}

export async function remove(id: number) {
  const deletedUser = await prisma.user.delete({
    where: {
      id
    }
  });
  return deletedUser;
}
