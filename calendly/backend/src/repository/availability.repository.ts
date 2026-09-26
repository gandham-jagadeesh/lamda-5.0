import { prisma } from "../config/database.js"
import { createAvailabilityExceptionDTO, createAvailbilityRuleDTO, updateAvailabilityExceptionDTO } from "../dtos/availbility.dto.js";

export async function createRule(rule: createAvailbilityRuleDTO,userId:number) {
  const createdRule = await prisma.availabilityRule.create({ data: { ...rule, user_id: userId } });
  return createdRule;
}

//TODO apply pagination
export async function getRules(userId: number) {
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

export async function removeException(id: number) {
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

//NOTE added neutral time stamp to make sure js internally won't edit date to before or after date's based on local utc timings
export async function updateException(id: number, ex: updateAvailabilityExceptionDTO) {
  const { date, ...rest} = ex;
  const updatedException = await prisma.availabilityException.update({
    where: {
      id: id
    },
    data: {
      ...rest,
      ...(date !== undefined && {date : new Date(`{date}T00:00:00.000Z`)}),
    },
  });
  return updatedException;
}

export async function createException(ex: createAvailabilityExceptionDTO, userId: number) {
  const { date, ...exception } = ex;
  const createdException = await prisma.availabilityException.create({
    data: { ...exception,date:new Date(`${date}T00:00:00.000Z`), user_id: userId }
  });
  return createdException;
}

// NOTE get exception by date
export async function getExceptionByDate(date:string,userId:number) {
  const exceptions = await prisma.availabilityException.findMany({
    where: {
      date: new Date(`${date}T00:00:00.000Z`),
      user_id:userId
    },
    orderBy: {
      updatedAt:"desc"
    }
  });
  return exceptions;
}
