import { createAvailbilityRuleDTO, updateAvailbilityRuleDTO } from "../dtos/availbility.dto.js";
import * as availability from "../repository/availability.repository.js";
import { badRequest, notFound, unauthorized } from "../utils/api-error.js";

export async function createRule(userId: number, rule: createAvailbilityRuleDTO) {

  if (rule.startTime > rule.endTime) {
    throw badRequest("end Time must be greater than startTime");
  }

  const createdRule = await availability.createRule(rule, userId);
  return createdRule;
}


export async function removeRule(id: number, userId: number) {
  const rule = await availability.getRule(id);
  if (!rule) {
    throw notFound("such rule not found");
  }
  if (rule.user_id !== userId) {
    throw unauthorized("you are not authorized to access the rule");
  }
  const removedRule = await availability.removeRule(id);
  return removedRule;
}

export async function updateRule(id: number, rule: updateAvailbilityRuleDTO, userId: number) {
  const existedRule = await availability.getRule(id);
  if (!existedRule) {
    throw notFound("rule not found");
  }
  if (existedRule.user_id !== userId) {
    throw unauthorized("you are not authorized to access the rule");
  }
  const updatedRule = await availability.updateRule(id, rule);
  return updatedRule;
}


export async function getRule(id: number,userId:number) {
  const existedRule = await availability.getRule(id);
  if (!existedRule) {
    console.log(`[get a single rule for a loggedin user]`, existedRule);
    throw notFound("rule not found");
  }
  if (existedRule.user_id !== userId) {
    throw unauthorized("you are not authorized to access the rule");
  }
  const rule = await availability.getRule(id);
  if (!rule) {
    throw notFound("rule not Found");
  }
  return rule;
}


export async function getRules(user_id:number) {
  const rules = await availability.getRules(user_id);
  return rules;
}
