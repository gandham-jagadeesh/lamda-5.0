import { prisma } from "../config/database.js"
import { createAvailbilityRuleDTO, updateAvailabilityExceptionDTO } from "../dtos/availbility.dto.js";

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
