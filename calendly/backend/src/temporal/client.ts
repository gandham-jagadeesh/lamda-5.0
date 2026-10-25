import { TEMPORAL_ENABLED, TEMPORAL_TASK_QUEUE } from "../config/env.js";
import { getTemporalClient } from "../config/temporal.js";
import { regenerateHostSlotsInput } from "../services/slot-generation.service.js";



async function startWorkFlow(workflowName: string, workflowId: string, args: unknown[]) {
  if (!TEMPORAL_ENABLED) {
    console.warn('[Temporal] not enabled skipping workflow');
    return null;
  }
  try {
    const client = await  Promise.race([
      getTemporalClient(),
      new Promise<never>((_, rej) =>setTimeout(()=>rej(new Error("Temporal client connection Timeout")),5000))
    ]);
    const handle = await client.workflow.start(workflowName,{
      taskQueue: TEMPORAL_TASK_QUEUE,
      workflowId,
      args
    });
    return handle.workflowId;
  }
  catch (err) {
    console.error(`[temporal] Error starting worflow : ${workflowName} with id ${workflowName}`);
    return null;
  }
}


export async function runSlotGenWorkflow(input: regenerateHostSlotsInput) {
  return startWorkFlow('genSlotsWorkflow', `regenerate-host-slots-${input.hostId}-${Date.now()}`, [input]);
}
