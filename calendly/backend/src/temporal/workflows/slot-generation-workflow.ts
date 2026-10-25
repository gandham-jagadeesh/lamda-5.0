import { proxyActivities } from "@temporalio/workflow";
import type * as activites from "../activites/index.js";
import { regenerateHostSlotsInput } from "../../services/slot-generation.service.js";


const { slotGenActivity } = proxyActivities<typeof activites>({
  retry: { maximumAttempts: 3 },
  startToCloseTimeout:'10 minutes'
});


export async function genSlotsWorkflow(input:regenerateHostSlotsInput) {
  await slotGenActivity(input);
}
