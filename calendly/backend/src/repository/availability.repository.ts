import { prisma } from "../config/database.js"
import { createAvailabilityExceptionDTO, createAvailbilityRuleDTO, updateAvailabilityExceptionDTO } from "../dtos/availbility.dto.js";

export async function createRule(rule: createAvailbilityRuleDTO,userId:number) {
  const createdRule = await prisma.availabilityRule.create({ data: { ...rule, user_id: userId } });
  return createdRule;
}

//TODO apply pagination
export async function getRules(userId: number) {
  console.log(`repo layer : ${userId}`);
  const allRules = await prisma.availabilityRule.findMany({
    where: {
      user_id: userId
    },
    orderBy: {
      updatedAt:"desc"
    }
  });
  return allRules;
}

export async function removeRule(id:number) {
  const removedRule = await prisma.availabilityRule.delete({
    where: {
      id: id
    }
  });
  return removedRule;
}

export async function updateRule(id: number, rule: updateAvailabilityExceptionDTO) {
  const updatedRule = await prisma.availabilityRule.update({
    where: {
      id: id,
    },
    data: rule
  });
  return updatedRule;
}

export async function getRuleByweek(userId:number,week: string) {
  const rules = await prisma.availabilityRule.findMany({
    where: {
    user_id:userId,
      weekday: week
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
  return rules
}

export async function getRule(id: number) {
  const rule = await prisma.availabilityRule.findFirst({
    where: {
      id: id
    }
  });
  return rule;
}


export async function getException(id: number) {
  const exception = await prisma.availabilityException.findFirst({
    where: {
      id: id
    }
  });
  return exception;
}

export async function removeExceptions(id: number) {
  const removedException = await prisma.availabilityException.delete({
    where: {
      id: id
    }
  });
  return removedException;
}

//TODO apply pagination
export async function getAllExceptions(userId: number) {
  const userExceptions = await prisma.availabilityException.findMany({
    where: {
      user_id: userId
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
  return userExceptions;
}

export async function updateException(id: number, ex: updateAvailabilityExceptionDTO) {
  const updatedException = await prisma.availabilityException.update({
    where: {
      id: id
    },
    data: ex
  });
  return updatedException;
}

export async function createException(ex: createAvailabilityExceptionDTO,userId:number) {
  const createdException = await prisma.availabilityException.create({
    data: { ...ex, user_id: userId }
  });
  return createdException;
}

// NOTE get exception by date
export async function getExceptionByDate(date:Date) {
  const exceptions = await prisma.availabilityException.findMany({
    where: {
      date:date
    },
    orderBy: {
      updatedAt:"desc"
    }
  });
  return exceptions;
}
