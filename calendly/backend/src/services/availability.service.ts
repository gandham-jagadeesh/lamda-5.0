import { copyFileSync } from "node:fs";
import { createAvailabilityExceptionDTO, createAvailbilityRuleDTO, updateAvailbilityRuleDTO } from "../dtos/availbility.dto.js";
import * as availability from "../repository/availability.repository.js";
import { notFound, unauthorized } from "../utils/api-error.js";

export async function createRule(userId: number, rule: createAvailbilityRuleDTO) {
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

export async function createException(exception: createAvailabilityExceptionDTO, userId: number) {
  const createdException = await availability.createException({...exception}, userId);
  return createdException;
}


export async function removeException(id: number, userId: number) {
  const exception = await availability.getException(id);
  if (!exception) {
    throw notFound("no exception found");
  }
  if (exception && exception.user_id !== userId) {
    throw unauthorized("cannot access exception");
  }
  const removedException = await availability.removeException(id);
  return removedException;
}


export async function updateException(id: number, ex: updateAvailbilityRuleDTO, userId: number) {
  const exception = await availability.getException(id);
  if (!exception) {
    throw notFound("no exception found");
  }
  if (exception && exception.user_id !== userId) {
    throw unauthorized("cannot access exception");
  }
  const updatedException = await availability.updateException(id, ex);
  return updatedException;
}


export async function getAllExceptions(userId: number) {
  const allExceptions = await availability.getAllExceptions(userId);
  return allExceptions;
}

export async function getbyDate(userId: number, date: string) {
  const exceptionsByDate = await availability.getExceptionByDate(date,userId);
  return exceptionsByDate;
}

export async function getException(id: number, userId: number) {
  const exception = await availability.getException(id);
  console.log(`[service layer : ${exception}  value : ${!exception}]`);
    if (!exception) {
      throw notFound("no exception found");
    }
    if (exception && exception.user_id !== userId) {
      throw unauthorized("cannot access exception");
    }
  return exception;
  }
